import React from 'react';
import './Scores.css';

const Scores = () => {
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
          <div className="scores-row">
            <div className="scores-first body-section">John</div>
            <div className="scores-last body-section">Doe</div>
            <div className="scores-class body-section">Period 1</div>
            <div className="scores-complete body-section">100%</div>
            <div className="scores-score body-section">80%</div>
            <div className="scores-time body-section">15:00</div>
          </div>
          <div className="scores-row">
            <div className="scores-first body-section">Jane</div>
            <div className="scores-last body-section">Doe</div>
            <div className="scores-class body-section">Period 1</div>
            <div className="scores-complete body-section">100%</div>
            <div className="scores-score body-section">80%</div>
            <div className="scores-time body-section">15:00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scores;
