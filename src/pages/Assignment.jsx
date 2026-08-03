import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import skillMap from '../skills/skillMap.js';
import './Assignment.css';
import { InlineMath } from 'react-katex';

export default function Assignment() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = Number(searchParams.get('studentId'));

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [attempt, setAttempt] = useState(null);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [attemptError, setAttemptError] = useState('');
  const [savedResults, setSavedResults] = useState([]);

  const startTimeRef = useRef(Date.now());

  const lastSubmittedIndex = useRef(null);
  const lastSubmittedStatus = useRef(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/assignments/${assignmentId}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch assignment.');
        }

        const data = await response.json();

        console.log('Fetched assignment:', data);
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
    console.log('Assignment:', assignment);

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
    setUserAnswers({ ...userAnswers, [index]: input });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    const input = userAnswers[currentProblemIndex];
    const problem = problems[currentProblemIndex];
    const skill = skillMap[problem.type];

    if (!skill || !skill.validateAnswer) {
      console.warn(`No validator found for type: ${problem.type}`);
      return;
    }

    if (!attempt?.id) {
      console.warn('No active assignment attempt found.');
      return;
    }

    const status = skill.validateAnswer(input, problem);

    const updatedStatusMap = {
      ...statusMap,
      [currentProblemIndex]: status,
    };

    let nextProblemIndex = currentProblemIndex;

    if (status === 'correct') {
      const nextUnanswered = problems.findIndex(
        (_, index) => !updatedStatusMap[index],
      );

      if (nextUnanswered !== -1) {
        nextProblemIndex = nextUnanswered;
      }
    }

    const scoreAwarded =
      status === 'correct' ? 1 : status === 'partial' ? 0.5 : 0;

    try {
      const response = await fetch(
        `http://localhost:5000/api/attempts/${attempt.id}/problems/${
          currentProblemIndex + 1
        }`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
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
          responseData.message || 'Failed to save problem progress.',
        );
      }

      setAttempt((previousAttempt) => ({
        ...previousAttempt,
        current_problem_index: responseData.attempt.currentProblemIndex,
        total_answered: responseData.attempt.totalAnswered,
        total_correct: responseData.attempt.totalCorrect,
        score: responseData.attempt.score,
        time_spent_seconds: responseData.attempt.timeSpentSeconds,
      }));
    } catch (error) {
      console.error('Failed to save problem progress:', error);

      setModalMessage(`❌ Progress was not saved: ${error.message}`);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
      }, 3000);

      return;
    }

    lastSubmittedIndex.current = currentProblemIndex;
    lastSubmittedStatus.current = status;

    setStatusMap(updatedStatusMap);

    const emojiMessages = {
      correct: '✅ Correct! Good job.',
      incorrect: '❌ Incorrect! Try again.',
      partial: '⚠️ Partially Correct!',
      unanswered: '🤔 Unanswered!',
    };

    setModalMessage(emojiMessages[status] || `🤷 Unknown status: ${status}`);

    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  useEffect(() => {
    if (lastSubmittedStatus.current === 'correct') {
      const nextUnanswered = problems.findIndex((_, i) => !statusMap[i]);
      if (
        nextUnanswered !== -1 &&
        nextUnanswered !== lastSubmittedIndex.current
      ) {
        setTimeout(() => {
          setCurrentProblemIndex(nextUnanswered);
        }, 3000);
      }
    }
  }, [statusMap]);

  useEffect(() => {
    const startAttempt = async () => {
      if (!studentId) {
        setAttemptError('No student selected.');
        setAttemptLoading(false);
        return;
      }
      setAttempt(null);
      setSavedResults([]);
      setUserAnswers({});
      setStatusMap({});
      setCurrentProblemIndex(0);
      setTimeSpent(0);
      startTimeRef.current = Date.now();
      try {
        setAttemptLoading(true);
        setAttemptError('');

        console.log({
          studentId: studentId,
          assignmentId: Number(assignmentId),
        });

        const response = await fetch(
          'http://localhost:5000/api/attempts/start',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
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
            responseData.message || 'Failed to start assignment attempt.',
          );
        }

        const loadedAttempt = responseData.attempt;
        const loadedResults = responseData.problemResults;

        setAttempt(loadedAttempt);
        setSavedResults(loadedResults);

        console.log('Attempt:', loadedAttempt);
        console.log('Saved results:', loadedResults);
      } catch (error) {
        console.error('Failed to start attempt:', error);
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
      restoredAnswers[index] = '';
    });

    // Replace blanks with any saved database values.
    savedResults.forEach((result) => {
      const problemIndex = Number(result.problem_number) - 1;

      let savedAnswer = result.student_answer;

      if (typeof savedAnswer === 'string') {
        try {
          savedAnswer = JSON.parse(savedAnswer);
        } catch {
          // Keep an ordinary string as-is.
        }
      }

      restoredAnswers[problemIndex] = savedAnswer ?? '';
      restoredStatuses[problemIndex] = result.status;
    });

    setUserAnswers(restoredAnswers);
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

  const currentStatus = statusMap[currentProblemIndex] || 'unanswered';
  const sidebarStatusClass = `side-content status-${currentStatus}`;

  const displayStatus =
    (statusMap[currentProblemIndex] || 'unanswered').charAt(0).toUpperCase() +
    (statusMap[currentProblemIndex] || 'unanswered').slice(1);

  return (
    <div className="assignment-wrapper">
      <div className="top-section">
        <div className="problem-selector">
          {problems.map((_, index) => {
            const status = statusMap[index];
            const isActive = index === currentProblemIndex;

            let className = 'problem-tab';
            if (status === 'correct') className += ' correct';
            else if (status === 'partial') className += ' partial';
            else if (status === 'incorrect') className += ' incorrect';

            if (isActive) className += ' active';

            return (
              <button
                key={index}
                className={className}
                onClick={() => setCurrentProblemIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="main-section">
        <h2 className="question-title">Question {currentProblemIndex + 1}</h2>
        <div className="problem-wrapper">
          <h2 className="assignment-title">
            {assignment?.metadata?.assignmentName}
          </h2>
          <div className="problem-display">
            {currentProblem && (
              <div className="problem" key={currentProblemIndex}>
                {skillMap[currentProblem.type]?.renderProblem(
                  userAnswers[currentProblemIndex] || '',
                  currentProblem,
                  handleInputChange,
                  currentProblemIndex,
                  handleSubmit,
                )}
              </div>
            )}
            {statusMap[currentProblemIndex] && (
              <div className="answer-badge">
                Your Answer:
                <InlineMath math={userAnswers[currentProblemIndex]} />
              </div>
            )}
          </div>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <div className="sidebar">
          <div className="question-number-div sidebar-div">
            <p className="side-header question-header">Question</p>
            <p className="side-content">
              {currentProblemIndex + 1} / {problems.length}
            </p>
          </div>
          <div className="side-status-div sidebar-div">
            <p className="side-header">Status: </p>
            <p className={sidebarStatusClass}>{displayStatus}</p>
          </div>
          <div className="current-score-div sidebar-div">
            <p className="side-header">Score: </p>
            <p className="side-content">
              {(
                (Object.values(statusMap).filter((s) => s === 'correct')
                  .length /
                  problems.length) *
                100
              ).toFixed(2)}
              {'%'}
            </p>
          </div>
          <div className="question-time-div sidebar-div">
            <p className="side-header">Time Spent:</p>
            <div className="side-content">{formatTime(timeSpent)}</div>
          </div>
        </div>
      </div>
      {showModal && <div className="fade-modal">{modalMessage}</div>}
    </div>
  );
}
