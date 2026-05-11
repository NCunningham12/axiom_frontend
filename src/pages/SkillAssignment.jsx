import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import skillMap from '../skills/skillMap.js';
import './Assignment.css';
import { InlineMath } from 'react-katex';

export default function SkillAssignment() {
  const location = useLocation();
  const assignment = location.state?.assignment;

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  const lastSubmittedIndex = useRef(null);
  const lastSubmittedStatus = useRef(null);

  const generateSkillProblem = () => {
    const problemConfig = assignment?.problems?.[0];
    if (!problemConfig) return null;
    
    const skill = skillMap[problemConfig.type];

    if (!skill || typeof skill.generateProblem !== 'function') {
        console.warn(`No valid skill or generator found for type: ${problemConfig.type}`);
        return null
    }

    return {
        ...skill.generateProblem(problemConfig),
        type: problemConfig.type,
    };
  };

  useEffect(() => {
    console.log('Assignment: ', assignment);

    const firstProblem = generateSkillProblem();

    if (!firstProblem) return;

    setProblems([firstProblem]);
    setCurrentProblemIndex(0);
    setUserAnswers({ 0: '' });
    setStatusMap({});
  }, [assignment]);

  const handleInputChange = (index, input) => {
    setUserAnswers({ ...userAnswers, [index]: input });
  };

  const handleScoreUpdate = (correct) => {

    setCurrentScore((prevScore) => {
        const nextScore = correct 
            ? Math.min(100, prevScore + 10)
            : Math.max(0, prevScore - 7);

        if (nextScore >= 100) {
            setCurrentScore(100);
            setModalMessage('Mastery Reached!');
            setShowModal(true);
        }

        return nextScore;
    });
  };

  const handleSubmit = () => {
    const input = userAnswers[currentProblemIndex];
    const problem = problems[currentProblemIndex];
    const skill = skillMap[problem.type];

    if (!skill || !skill.validateAnswer) {
      console.warn(`No validator found for type: ${problem.type}`);
      return;
    }

    const status = skill.validateAnswer(input, problem);

    if (status === 'correct') {
        setCurrentStreak((prev) => prev + 1);
    } else {
        setCurrentStreak(0);
    }

    // Update statusMap
    lastSubmittedIndex.current = currentProblemIndex;
    lastSubmittedStatus.current = status;

    setStatusMap((prev) => ({
      ...prev,
      [currentProblemIndex]: status,
    }));

    handleScoreUpdate(status === 'correct');

    // Capitalize status for modal message
    const emojiMessages = {
      correct: '✅ Correct! Good job.',
      incorrect: '❌ Incorrect!',
      partial: '⚠️ Partially Correct!',
      unanswered: '🤔 Unanswered!',
    };

    const message = emojiMessages[status] || `🤷 Unknown status: ${status}`;
    setModalMessage(message);
    setShowModal(true);

    setTimeout(() => {
        const nextProblem = generateSkillProblem();
        if (!nextProblem) return;

        setProblems((prev) => {
            const nextIndex = prev.length;

            setCurrentProblemIndex(nextIndex);
            setUserAnswers((answers) => ({
                ...answers,
                [nextIndex]: '',
            }));

            return [...prev, nextProblem];
        });

        setShowModal(false);
    }, 1500);

    // Hide modal after 3 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  const currentProblem = problems[currentProblemIndex];

  const skillConfig = assignment?.problems?.[0];

  const currentStatus = statusMap[currentProblemIndex] || 'unanswered';
  const sidebarStatusClass = `side-content status-${currentStatus}`;

  const displayStatus =
    (statusMap[currentProblemIndex] || 'unanswered').charAt(0).toUpperCase() +
    (statusMap[currentProblemIndex] || 'unanswered').slice(1);

  return (
    <div className="assignment-wrapper">
      <div className="main-section">
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
                )}
              </div>
            )}
          </div>
          <button className="submit-btn" onClick={
            handleSubmit
            }>
            Submit
          </button>
        </div>

        <div className="sidebar">
          <div className="question-number-div sidebar-div">
            <p className="side-header question-header">Score</p>
            <p className="side-content">
              {currentScore}
            </p>
          </div>
          <div className="side-status-div sidebar-div">
            <p className="side-header">Score Target: </p>
            <p className="side-content">{skillConfig?.targetScore}</p>
          </div>
          <div className="current-score-div sidebar-div">
            <p className="side-header">Streak: </p>
            <p className="side-content">
              {currentStreak}
            </p>
          </div>
          <div className="question-time-div sidebar-div">
            <p className="side-header">Time Spent:</p>
            <p></p>
          </div>
        </div>
      </div>
      {showModal && <div className="fade-modal">{modalMessage}</div>}
    </div>
  );
}
