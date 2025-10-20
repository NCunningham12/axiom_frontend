import React from 'react';
import './Assignment.css';
import { InlineMath, BlockMath } from 'react-katex';
import { useLocation } from 'react-router-dom';
import './Assignment.css';
import { useState, useEffect } from 'react';
import { use } from 'react';

const Assignment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [baseInput, setBaseInput] = useState();
  const [expInput, setExpInput] = useState();

  const { state } = useLocation();
  const assignment = state?.assignment;

  useEffect(() => {
    setBaseInput('');
    setExpInput('');
  }, [currentIndex]);

  const handleSubmit = () => {
    const currentProblem = assignment.problems[currentIndex];
    const { base: correctBase, exponent: correctExponent } =
      currentProblem.answer;

    const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, '');

    const isBaseCorrect = normalize(baseInput) === correctBase;
    const isExpCorrect = normalize(expInput) === String(correctExponent);

    if (isBaseCorrect && isExpCorrect) {
      console.log('✅ Fully correct');
    } else if (isBaseCorrect || isExpCorrect) {
      console.log('🟡 Partially correct');
    } else {
      console.log('❌ Incorrect');
    }
  };

  return (
    <div className="assignment-container">
      <div className="assignment-wrapper">
        <div className="top-section">
          {assignment?.problems?.length > 0 && (
            <div className="problem-selector">
              {assignment.problems.map((_, index) => (
                <button
                  key={index}
                  className={`problem-tab ${
                    index === currentIndex ? 'active' : ''
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="main-section">
          <div className="problem-wrapper">
            {assignment?.problems?.length > 0 && (
              <div className="problem-display">
                <h2>{assignment.title}</h2>
                <p className="problem-directions">
                  {assignment.problems[currentIndex].directions}
                </p>
                <BlockMath math={assignment.problems[currentIndex].question} />
                <div className="math-input-group">
                  <input
                    type="text"
                    className="base-input"
                    value={baseInput}
                    onChange={(e) => setBaseInput(e.target.value)}
                  />
                  <input
                    type="text"
                    className="exponent-input"
                    value={expInput}
                    onChange={(e) => setExpInput(e.target.value)}
                  />
                </div>
              </div>
            )}
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
            <div className="problem-nav">
              <button
                className="prev-btn"
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
              >
                Previous
              </button>

              <button
                className="next-btn"
                onClick={() => {
                  setCurrentIndex((prev) =>
                    Math.min(prev + 1, assignment.problems.length - 1)
                  );
                }}
                disabled={currentIndex === assignment.problems.length - 1}
              >
                Next
              </button>
            </div>
          </div>
          <div className="sidebar"></div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
