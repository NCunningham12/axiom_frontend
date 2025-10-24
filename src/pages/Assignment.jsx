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
      <div className="top-section"></div>
      <div className="main-section">
        <h2 className="question-title">{assignment.title || 'Assignment'}</h2>

        <div className="problem-wrapper">
          <div className="problem-display">
            {currentProblem &&
              skill.renderProblem(currentProblem, handleInputChange)}
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>

        <div className="sidebar">
          <p>Status: {statusMap[currentProblemIndex] || 'unanswered'}</p>
          <p>
            Score:{' '}
            {Object.values(statusMap).filter((s) => s === 'correct').length} /{' '}
            {problems.length}
          </p>
        </div>
      </div>
    </div>
  );
}
