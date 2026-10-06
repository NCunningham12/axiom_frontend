import React, { useEffect, useState } from 'react';
import './Scores.css';

const Scores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/attempts/scores',
        );

        if (!response.ok) {
          throw new Error('Failed to fetch scores');
        }

        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="scores-container">
      <h1 className="scores-title">Scores</h1>
      <div className="scores-tools">Tools</div>
      <div className="scores-filters">Filters</div>
      <div className="scores-table-wrapper">
        <div className="scores-header-row">
          <div className="scores-first scores-header-section">First</div>
          <div className="scores-last scores-header-section">Last</div>
          <div className="scores-class scores-header-section">Class</div>
          <div className="scores-complete scores-header-section">Complete</div>
          <div className="scores-score scores-header-section">Score</div>
          <div className="scores-time scores-header-section">Time Spent</div>
        </div>
        <div className="body-rows">
          {scores.map((attempt) => (
            <div className="scores-row" key={attempt.attempt_id}>
              <div className="scores-first body-section">
                {attempt.first_name}
              </div>

              <div className="scores-last body-section">
                {attempt.last_name}
              </div>

              <div className="scores-class body-section">
                {attempt.periods === 'all'
                  ? 'All Classes'
                  : attempt.periods.replace('period', 'Period ')}
              </div>

              <div className="scores-complete body-section">
                {attempt.total_problems > 0
                  ? `${Math.round(
                      (attempt.total_answered / attempt.total_problems) * 100,
                    )}%`
                  : '—'}
              </div>

              <div className="scores-score body-section">
                {attempt.score !== null
                  ? `${Number(attempt.score).toFixed(0)}%`
                  : '—'}
              </div>

              <div className="scores-time body-section">
                {Math.floor(attempt.time_spent_seconds / 60)}:
                {String(attempt.time_spent_seconds % 60).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scores;
