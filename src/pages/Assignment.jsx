import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import skillMap from '../skills/skillMap';
import './Assignment.css';

export default function Assignment() {
  const location = useLocation();
  const assignment = location.state?.assignment;

  const skillId = assignment?.skill;
  const skill = skillMap[skillId];

  if (!assignment) {
    return (
      <p>❌ No assignment data received. Were you routed here directly?</p>
    );
  }

  if (!skill) {
    return <p>❌ Invalid or unsupported skill ID: "{skillId}"</p>;
  }

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    const newProblems = Array.from({ length: 10 }, () =>
      skill.generateProblem()
    );
    setProblems(newProblems);
  }, [skill]);

  const handleInputChange = (input) => {
    setUserAnswers({ ...userAnswers, [currentProblemIndex]: input });
  };

  const handleSubmit = () => {
    const input = userAnswers[currentProblemIndex];
    const problem = problems[currentProblemIndex];
    const status = skill.validateAnswer(input, problem);
    setStatusMap({ ...statusMap, [currentProblemIndex]: status });

    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex((prev) => prev + 1);
    }
  };

  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="assignment-wrapper">
      <div className="top-section">
        <div className="problem-selector">
          {problems.map((_, index) => {
            const status = statusMap[index];
            const isActive = index === currentProblemIndex;

            let className = 'problem-tab';
            if (status === 'correct') className += ' problem-tab.correct';
            else if (status === 'partial') className += ' problem-tab.partial';
            else if (status === 'incorrect')
              className += ' problem-tab.incorrect';

            if (isActive) className += ' problem-tab.active';

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
        <h2 className="question-title">{assignment.title || 'Assignment'}</h2>

        <div className="problem-wrapper">
          <div className="problem-display">
            {currentProblem &&
              skill.renderProblem(
                userAnswers[currentProblemIndex] || '',
                currentProblem,
                handleInputChange
              )}
          </div>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <div className="sidebar">
          <div className="question-number-div">
            <p>
              Question {currentProblemIndex + 1} / {problems.length}
            </p>
          </div>
          <div className="side-status-div">
            <p>Status: {statusMap[currentProblemIndex] || 'Unanswered'}</p>
          </div>
          <div className="current-score-div">
            <p>
              Score:{' '}
              {Object.values(statusMap).filter((s) => s === 'correct').length} /{' '}
              {problems.length}
            </p>
          </div>
          <div className="question-time-div">
            <p>Time Spent:</p>
          </div>
        </div>
      </div>
    </div>
  );
}
