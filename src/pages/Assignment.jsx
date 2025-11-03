import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import skillMap from '../skills/skillMap';
import generatorMap from '../utils/generators/generatorMap.js';
import './Assignment.css';

export default function Assignment() {
  const location = useLocation();
  const assignment = location.state?.assignment;

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const lastSubmittedIndex = useRef(null);
  const lastSubmittedStatus = useRef(null);

  useEffect(() => {
    if (!assignment?.problems) return;

    const newProblems = assignment.problems
      .map((problemConfig) => {
        const generator = generatorMap[problemConfig.type];
        if (!generator) {
          console.warn(`No generator found for type: ${problemConfig.type}`);
          return null;
        }
        return generator();
      })
      .filter(Boolean);

    setProblems(newProblems);
  }, [assignment]);

  const handleInputChange = (index, input) => {
    setUserAnswers({ ...userAnswers, [index]: input });
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

    // Update statusMap
    lastSubmittedIndex.current = currentProblemIndex;
    lastSubmittedStatus.current = status;

    setStatusMap((prev) => ({
      ...prev,
      [currentProblemIndex]: status,
    }));

    // Capitalize status for modal message
    const emojiMessages = {
      correct: '✅ Correct! Good job.',
      incorrect: '❌ Incorrect! Try again.',
      partial: '⚠️ Partiall Correct!',
      unanswered: '🤔 Unanswered!',
    };

    const message = emojiMessages[status] || `🤷 Unknown status: ${status}`;
    setModalMessage(message);
    setShowModal(true);

    // Hide modal after 3 seconds
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
          <div className="problem-display">
            {currentProblem &&
              skillMap[currentProblem.type]?.renderProblem(
                userAnswers[currentProblemIndex] || '',
                currentProblem,
                handleInputChange,
                currentProblemIndex
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
              {(Object.values(statusMap).filter((s) => s === 'correct').length /
                problems.length) *
                100}
              {'%'}
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
