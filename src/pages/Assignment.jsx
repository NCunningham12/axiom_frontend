import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as skillMap from '../skills/skillMap.js'; // Maps skillId to its file

export default function Assignment() {
  const { skillId } = useParams();
  const skill = skillMap[skillId];

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
    const status = skill.validateAnswer(input, problem); // "correct", "incorrect", etc.
    setStatusMap({ ...statusMap, [currentProblemIndex]: status });

    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex((prev) => prev + 1);
    }
  };

  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="assignment-container">
      <div className="problem-area">
        {currentProblem &&
          skill.renderProblem(currentProblem, handleInputChange)}
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div className="status-panel">
        <p>Status: {statusMap[currentProblemIndex] || 'unanswered'}</p>
        <p>
          Score:{' '}
          {Object.values(statusMap).filter((s) => s === 'correct').length} /{' '}
          {problems.length}
        </p>
      </div>
    </div>
  );
}
