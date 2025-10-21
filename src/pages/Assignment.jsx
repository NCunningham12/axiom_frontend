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
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

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

    let status = 'incorrect';
    if (isBaseCorrect && isExpCorrect) {
      status = 'correct';
    } else if (isBaseCorrect || isExpCorrect) {
      status = 'partial';
    }

    setSubmissionStatus((prev) => ({
      ...prev,
      [currentIndex]: status,
    }));

    // Set the modal message
    let message = '';
    if (status === 'correct') message = '✅ Correct!';
    else if (status === 'partial') message = '⚠️ Partially Correct';
    else message = '❌ Incorrect';

    setModalMessage(message);
    setShowModal(true);

    // Fade out modal after 2 seconds
    setTimeout(() => {
      setShowModal(false);

      // Only auto-advance if correct
      if (status === 'correct') {
        const nextUnanswered = assignment.problems.findIndex(
          (_, i) => i > currentIndex && !submissionStatus[i]
        );

        if (nextUnanswered !== -1) {
          setCurrentIndex(nextUnanswered);
        }
      }
    }, 2000);
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
                  } ${
                    submissionStatus[index] === 'correct'
                      ? 'correct'
                      : submissionStatus[index] === 'partial'
                      ? 'partial'
                      : submissionStatus[index] === 'incorrect'
                      ? 'incorrect'
                      : ''
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
          <h2 className="question-title">Question {currentIndex + 1}</h2>
          <div className="problem-wrapper">
            {assignment?.problems?.length > 0 && (
              <div className="problem-display">
                <h3>{assignment.title}</h3>
                <p className="problem-directions">
                  {assignment.problems[currentIndex].directions}
                </p>
                {submissionStatus[currentIndex] && (
                  <span
                    className={`status-badge ${submissionStatus[currentIndex]}`}
                  >
                    {submissionStatus[currentIndex] === 'correct' &&
                      'Correct ✅'}
                    {submissionStatus[currentIndex] === 'partial' &&
                      'Partially Correct ⚠️'}
                    {submissionStatus[currentIndex] === 'incorrect' &&
                      'Incorrect ❌'}
                  </span>
                )}
                <BlockMath
                  className="katex"
                  math={assignment.problems[currentIndex].question}
                />
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
      {showModal && (
        <div className="fade-modal">
          <p>{modalMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Assignment;
