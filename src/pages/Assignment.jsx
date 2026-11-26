import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "../context/StudentContext";
import skillMap from "../skills/skillMap.js";
import "./Assignment.css";
import { InlineMath } from "react-katex";

export default function Assignment() {
  const { assignmentId } = useParams();
  const { currentStudent } = useStudent();
  const studentId = currentStudent?.id;
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [successFeedback, setSuccessFeedback] = useState(null);
  const [answerError, setAnswerError] = useState("");
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [attempt, setAttempt] = useState(null);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [attemptError, setAttemptError] = useState("");
  const [savedResults, setSavedResults] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showUnsubmitModal, setShowUnsubmitModal] = useState(false);
  const [unsubmittingAssignment, setUnsubmittingAssignment] = useState(false);
  const [unsubmitError, setUnsubmitError] = useState("");

  const isReviewMode = attempt?.status === "completed";

  const startTimeRef = useRef(Date.now());

  const advanceTimerRef = useRef(null);
  const feedbackTimerRef = useRef(null);
  const checkingAnswerRef = useRef(false);
  const attemptSessionRef = useRef(0);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/assignments/${assignmentId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assignment.");
        }

        const data = await response.json();

        console.log("Fetched assignment:", data);
        setAssignment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    console.log("Assignment:", assignment);

    if (!assignment?.problems) return;

    const newProblems = assignment.problems
      .map((problemConfig) => {
        if (!problemConfig.problemData) {
          console.warn(
            `No persisted problem data found for type: ${problemConfig.type}`,
          );
          return null;
        }

        return problemConfig.problemData;
      })
      .filter(Boolean);

    setProblems(newProblems);
  }, [assignment]);

  const handleInputChange = (index, input) => {
    if (isReviewMode || statusMap[index] === "correct") return;

    setUserAnswers({ ...userAnswers, [index]: input });
  };

  useEffect(() => {
    if (!attempt || isReviewMode) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      setTimeSpent(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [attempt?.id, isReviewMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const cancelAutoAdvance = () => {
    clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;
  };

  const handleQuestionNavigation = (index) => {
    cancelAutoAdvance();
    setAnswerError("");
    setCurrentProblemIndex(index);
  };

  useEffect(() => {
    return () => {
      clearTimeout(advanceTimerRef.current);
      clearTimeout(feedbackTimerRef.current);
      attemptSessionRef.current += 1;
    };
  }, [assignmentId, studentId]);

  const handleSubmit = async () => {
    if (isQuestionLocked || checkingAnswerRef.current) return;

    const submittedIndex = currentProblemIndex;
    const input = userAnswers[submittedIndex] ?? "";
    const problem = problems[submittedIndex];
    const skill = skillMap[problem?.type];

    setAnswerError("");

    if (!input.trim()) {
      setAnswerError("Enter an answer before checking.");
      return;
    }

    if (!skill || !skill.validateAnswer) {
      console.warn(`No validator found for type: ${problem?.type}`);
      return;
    }

    if (!attempt?.id) {
      console.warn("No active assignment attempt found.");
      return;
    }

    cancelAutoAdvance();

    clearTimeout(feedbackTimerRef.current);
    setSuccessFeedback(null);

    const session = attemptSessionRef.current;

    checkingAnswerRef.current = true;
    setCheckingAnswer(true);

    try {
      const status = skill.validateAnswer(input, problem);

      const updatedStatusMap = {
        ...statusMap,
        [submittedIndex]: status,
      };

      let nextProblemIndex = submittedIndex;

      if (status === "correct") {
        const nextUnanswered = problems.findIndex(
          (_, index) =>
            !updatedStatusMap[index] ||
            updatedStatusMap[index] === "unanswered",
        );

        if (nextUnanswered !== -1) {
          nextProblemIndex = nextUnanswered;
        }
      }

      const scoreAwarded =
        status === "correct" ? 1 : status === "partial" ? 0.5 : 0;

      const response = await fetch(
        `http://localhost:5000/api/attempts/${attempt.id}/problems/${
          submittedIndex + 1
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentAnswer: input,
            status,
            scoreAwarded,
            currentProblemIndex: nextProblemIndex,
            timeSpentSeconds: timeSpent,
          }),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to save problem progress.",
        );
      }

      if (session !== attemptSessionRef.current) return;

      setAttempt((previousAttempt) => ({
        ...previousAttempt,
        current_problem_index: responseData.attempt.currentProblemIndex,
        total_answered: responseData.attempt.totalAnswered,
        total_correct: responseData.attempt.totalCorrect,
        score: responseData.attempt.score,
        time_spent_seconds: responseData.attempt.timeSpentSeconds,
      }));

      setStatusMap(updatedStatusMap);

      if (status !== "unanswered") {
        setSubmittedAnswers((previousAnswers) => ({
          ...previousAnswers,
          [submittedIndex]: input,
        }));

        setUserAnswers((previousAnswers) => ({
          ...previousAnswers,
          [submittedIndex]: "",
        }));
      }

      // Celebrate a successfully saved correct answer.
      if (status === "correct") {
        setSuccessFeedback({
          questionNumber: submittedIndex + 1,
        });

        // Advance after a brief moment of recognition.
        if (nextProblemIndex !== submittedIndex) {
          advanceTimerRef.current = setTimeout(() => {
            setCurrentProblemIndex(nextProblemIndex);
            advanceTimerRef.current = null;
          }, 1000);
        }

        // Remove the notification after 1.5 seconds.
        feedbackTimerRef.current = setTimeout(() => {
          setSuccessFeedback(null);
          feedbackTimerRef.current = null;
        }, 1500);
      }
    } catch (error) {
      if (session !== attemptSessionRef.current) return;

      console.error("Failed to save problem progress:", error);

      setAnswerError(`Progress was not saved: ${error.message}`);
    } finally {
      if (session === attemptSessionRef.current) {
        checkingAnswerRef.current = false;
        setCheckingAnswer(false);
      }
    }
  };

  useEffect(() => {
    const startAttempt = async () => {
      console.log("START ATTEMPT VALUES: ", {
        studentId,
        assignmentId,
      });

      setAttempt(null);
      setSavedResults([]);
      setUserAnswers({});
      setSubmittedAnswers({});
      setStatusMap({});
      setCurrentProblemIndex(0);
      setTimeSpent(0);
      startTimeRef.current = Date.now();

      cancelAutoAdvance();
      clearTimeout(feedbackTimerRef.current);

      checkingAnswerRef.current = false;
      setCheckingAnswer(false);
      setSuccessFeedback(null);
      setAnswerError("");

      if (!studentId) {
        setAttemptError("No student selected.");
        setAttemptLoading(false);
        return;
      }
      try {
        setAttemptLoading(true);
        setAttemptError("");

        console.log({
          studentId: studentId,
          assignmentId: Number(assignmentId),
        });

        const response = await fetch(
          "http://localhost:5000/api/attempts/start",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: studentId,
              assignmentId: Number(assignmentId),
            }),
          },
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || "Failed to start assignment attempt.",
          );
        }

        const loadedAttempt = responseData.attempt;
        const loadedResults = responseData.problemResults;

        setAttempt(loadedAttempt);
        setSavedResults(loadedResults);

        console.log("Attempt:", loadedAttempt);
        console.log("Saved results:", loadedResults);
      } catch (error) {
        console.error("Failed to start attempt:", error);
        setAttemptError(error.message);
      } finally {
        setAttemptLoading(false);
      }
    };

    startAttempt();
  }, [assignmentId, studentId]);

  useEffect(() => {
    if (!attempt || problems.length === 0) {
      return;
    }

    const restoredAnswers = {};
    const restoredStatuses = {};

    // Give every problem a blank answer first.
    problems.forEach((_, index) => {
      restoredAnswers[index] = "";
    });

    // Replace blanks with any saved database values.
    savedResults.forEach((result) => {
      const problemIndex = Number(result.problem_number) - 1;

      let savedAnswer = result.student_answer;

      if (typeof savedAnswer === "string") {
        try {
          savedAnswer = JSON.parse(savedAnswer);
        } catch {
          // Keep an ordinary string as-is.
        }
      }

      restoredAnswers[problemIndex] = savedAnswer ?? "";
      restoredStatuses[problemIndex] = result.status;
    });

    setUserAnswers({});
    setSubmittedAnswers(restoredAnswers);
    setStatusMap(restoredStatuses);

    const restoredProblemIndex = Number(attempt.current_problem_index) || 0;

    const safeProblemIndex =
      restoredProblemIndex >= 0 && restoredProblemIndex < problems.length
        ? restoredProblemIndex
        : 0;

    setCurrentProblemIndex(safeProblemIndex);

    const savedTime = Number(attempt.time_spent_seconds) || 0;

    setTimeSpent(savedTime);
    startTimeRef.current = Date.now() - savedTime * 1000;
  }, [attempt?.id, savedResults, problems]);

  const currentProblem = problems[currentProblemIndex];

  const currentStatus = statusMap[currentProblemIndex] || "unanswered";
  const isQuestionLocked = isReviewMode || currentStatus === "correct";
  const sidebarStatusClass = `side-content status-${currentStatus}`;

  const displayStatus =
    (statusMap[currentProblemIndex] || "unanswered").charAt(0).toUpperCase() +
    (statusMap[currentProblemIndex] || "unanswered").slice(1);

  if (!studentId) {
    return <p>Please select a test student to open this assignment.</p>;
  }

  if (loading || attemptLoading) {
    return <p>Loading assignment...</p>;
  }

  if (error || attemptError) {
    return <p>{error || attemptError}</p>;
  }

  if (!assignment || !attempt) {
    return <p>Unable to load assignment.</p>;
  }

  // Sidebar statistics calculations

  const statuses = Object.values(statusMap);

  const correctCount = statuses.filter((status) => status === "correct").length;

  const incorrectCount = statuses.filter(
    (status) => status === "incorrect",
  ).length;

  const partialCount = statuses.filter((status) => status === "partial").length;

  const answeredCount = correctCount + incorrectCount + partialCount;

  const unansweredCount = problems.length - answeredCount;

  const completionPercentage = problems.length
    ? Math.round((answeredCount / problems.length) * 100)
    : 0;

  const assignmentScore = problems.length
    ? ((correctCount + partialCount * 0.5) / problems.length) * 100
    : 0;

  const allQuestionsAnswered = problems.length > 0 && unansweredCount === 0;

  const submitAssignment = async () => {
    if (
      !attempt?.id ||
      submittingAssignment ||
      isReviewMode ||
      checkingAnswerRef.current ||
      !allQuestionsAnswered
    )
      return;

    try {
      setSubmittingAssignment(true);
      setSubmitError("");

      const response = await fetch(
        `http://localhost:5000/api/attempts/${attempt.id}/submit`,
        {
          method: "PUT",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit assignment.");
      }

      navigate("/students/student-page", {
        state: {
          submissionSuccess: true,
        },
      });
    } catch (error) {
      console.error("Assignment submission failed:", error);
      setSubmitError(error.message);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const unsubmitAssignment = async () => {
    if (!attempt?.id || unsubmittingAssignment || !isReviewMode) return;

    try {
      setUnsubmittingAssignment(true);
      setUnsubmitError("");

      const response = await fetch(
        `http://localhost:5000/api/attempts/${attempt.id}/unsubmit`,
        {
          method: "PUT",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to unsubmit assignment.");
      }

      startTimeRef.current = Date.now() - timeSpent * 1000;

      setAttempt((previousAttempt) => ({
        ...previousAttempt,
        status: data.status,
        completed_at: null,
      }));

      setShowUnsubmitModal(false);
    } catch (error) {
      console.error("Assignment unsubmission failed:", error);
      setUnsubmitError(error.message);
    } finally {
      setUnsubmittingAssignment(false);
    }
  };

  return (
    <div className="assignment-wrapper">
      <header className="assignment-header">
        <h1>{assignment?.metadata?.assignmentName}</h1>
        <p>Standard Assignment</p>
      </header>

      <div className="top-section">
        <div className="question-nav-header">
          <h2>Questions</h2>
          <span>
            Question {currentProblemIndex + 1} of {problems.length}
          </span>
        </div>

        <div className="problem-selector">
          {problems.map((_, index) => {
            const status = statusMap[index] || "unanswered";
            const isActive = index === currentProblemIndex;

            return (
              <button
                key={index}
                className={`problem-tab ${status} ${isActive ? "active" : ""}`}
                onClick={() => handleQuestionNavigation(index)}
                disabled={checkingAnswer}
                aria-label={`Question ${index + 1}, ${status}`}
                aria-current={isActive ? "step" : undefined}
              >
                {index + 1}
                {status === "correct" && <span aria-hidden="true">✓</span>}
                {status === "incorrect" && <span aria-hidden="true">×</span>}
                {status === "partial" && <span aria-hidden="true">~</span>}
              </button>
            );
          })}
        </div>

        <div className="question-nav-legend">
          <span className="legend-correct">✓ Correct</span>
          <span className="legend-incorrect">× Incorrect</span>
          <span className="legend-unanswered">○ Unanswered</span>

          {Object.values(statusMap).includes("partial") && (
            <span className="legend-partial">~ Partially Correct</span>
          )}
        </div>
      </div>

      <div className="main-section">
        <div className="problem-container">
          <div className="problem-wrapper">
            <div className="question-wrap">
              <h2 className="question-title">
                Question {currentProblemIndex + 1} of {problems.length}
              </h2>

              <div className="question-header-badges">
                {isReviewMode && (
                  <span className="assignment-review-label">Review Mode</span>
                )}

                <span
                  className={`question-status-badge ${currentStatus}`}
                  role="status"
                >
                  {currentStatus === "correct" && "✓ Correct"}
                  {currentStatus === "incorrect" && "× Incorrect"}
                  {currentStatus === "unanswered" && "○ Unanswered"}
                  {currentStatus === "partial" && "~ Partially Correct"}
                </span>
              </div>
            </div>
            <div
              className="answer-feedback-region"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {successFeedback && (
                <div
                  key={successFeedback.questionNumber}
                  className="answer-success-toast"
                >
                  <span aria-hidden="true">✓</span>
                  Question {successFeedback.questionNumber} — Correct!
                </div>
              )}
            </div>
            <div className="problem-display">
              {currentProblem && (
                <div className="problem" key={currentProblemIndex}>
                  {skillMap[currentProblem.type]?.renderProblem(
                    isQuestionLocked
                      ? (submittedAnswers[currentProblemIndex] ?? "")
                      : (userAnswers[currentProblemIndex] ?? ""),
                    currentProblem,
                    handleInputChange,
                    currentProblemIndex,
                    handleSubmit,
                    isQuestionLocked,
                  )}
                </div>
              )}
              {submittedAnswers[currentProblemIndex] && (
                <div className={`previous-answer-panel ${currentStatus}`}>
                  <div className="previous-answer-header">
                    <span>
                      {isQuestionLocked ? "Your answer" : "Previous answer"}
                    </span>

                    <strong>
                      {currentStatus === "correct" && "✓ Correct"}
                      {currentStatus === "incorrect" && "× Incorrect"}
                      {currentStatus === "partial" && "~ Partially Correct"}
                    </strong>
                  </div>

                  <div className="previous-answer-math">
                    <InlineMath math={submittedAnswers[currentProblemIndex]} />
                  </div>
                </div>
              )}
            </div>
            {!isQuestionLocked && (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={checkingAnswer}
              >
                {checkingAnswer ? "Checking..." : "Check Answer"}
              </button>
            )}

            {answerError && (
              <p className="answer-error" role="alert">
                {answerError}
              </p>
            )}
          </div>
          <aside className="sidebar">
            <h2 className="sidebar-title">Assignment progress</h2>

            <div className="assignment-progress">
              <div className="assignment-progress-label">
                <span>
                  {answeredCount} of {problems.length} answered
                </span>
                <strong>{completionPercentage}%</strong>
              </div>

              <div
                className="assignment-progress-track"
                role="progressbar"
                aria-label="Assignment completion"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="assignment-progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="assignment-metrics">
              <div className="assignment-metric">
                <span>Score</span>
                <strong>{Number(assignmentScore.toFixed(2))}%</strong>
              </div>

              <div className="assignment-metric">
                <span>Time spent</span>
                <strong>{formatTime(timeSpent)}</strong>
              </div>
            </div>

            <div className="assignment-status-summary">
              <div className="assignment-status-row summary-correct">
                <span>✓ Correct</span>
                <strong>{correctCount}</strong>
              </div>

              <div className="assignment-status-row summary-incorrect">
                <span>× Incorrect</span>
                <strong>{incorrectCount}</strong>
              </div>

              {partialCount > 0 && (
                <div className="assignment-status-row summary-partial">
                  <span>~ Partially Correct</span>
                  <strong>{partialCount}</strong>
                </div>
              )}

              <div className="assignment-status-row summary-unanswered">
                <span>○ Unanswered</span>
                <strong>{unansweredCount}</strong>
              </div>
            </div>

            <div className="assignment-submission-section">
              {isReviewMode ? (
                <>
                  <h3>Assignment submitted</h3>
                  <p>You are currently reviewing your work.</p>

                  <button
                    className="submit-assignment"
                    onClick={() => {
                      setUnsubmitError("");
                      setShowUnsubmitModal(true);
                    }}
                  >
                    Unsubmit & Edit
                  </button>
                </>
              ) : (
                <>
                  <h3>
                    {allQuestionsAnswered
                      ? "All questions answered!"
                      : "Not ready to submit yet"}
                  </h3>

                  <p>
                    {allQuestionsAnswered
                      ? "You're ready to submit your assignment."
                      : `Answer ${unansweredCount} more ${
                          unansweredCount === 1 ? "question" : "questions"
                        } to submit.`}
                  </p>

                  <button
                    className="submit-assignment"
                    onClick={() => setShowSubmitModal(true)}
                    disabled={checkingAnswer || !allQuestionsAnswered}
                  >
                    Submit Assignment
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
      {showSubmitModal && (
        <div className="submit-modal-overlay">
          <div className="submit-modal">
            <h2>Submit Assignment?</h2>

            <p>You've completed {completionPercentage}% of this assignment.</p>

            <p>
              Your progress will be saved, and you can review your assignment
              after submitting.
            </p>

            {submitError && <p className="submit-error">{submitError}</p>}

            <div className="submit-modal-actions">
              <button
                disabled={submittingAssignment}
                onClick={() => setShowSubmitModal(false)}
              >
                Keep Working
              </button>

              <button
                disabled={submittingAssignment}
                onClick={submitAssignment}
              >
                {submittingAssignment ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showUnsubmitModal && (
        <div className="submit-modal-overlay">
          <div className="submit-modal">
            <h2>Unsubmit Assignment?</h2>

            <p>
              Your previous answers and progress will be saved, and you will be
              able to edit your work again.
            </p>

            <p className="submit-warning">
              This assignment will return to your To Do list until you submit it
              again.
            </p>

            {unsubmitError && <p className="submit-error">{unsubmitError}</p>}

            <div className="submit-modal-actions">
              <button
                disabled={unsubmittingAssignment}
                onClick={() => setShowUnsubmitModal(false)}
              >
                Cancel
              </button>

              <button
                disabled={unsubmittingAssignment}
                onClick={unsubmitAssignment}
              >
                {unsubmittingAssignment ? "Unsubmitting..." : "Unsubmit & Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
