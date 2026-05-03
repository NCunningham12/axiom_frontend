import React from 'react';
import './AssignmentList.css';

const AssignmentList = () => {
  return (
    <div className="assignment-list-container">
      <div className="assignment-list-wrapper">
        <div className="assignment-list-title-section">
          <h1 className="assignment-list-title">Assignments</h1>
          <div className="dropdown">
            <select id="periods" name="periods">
              <option value="all">All Periods</option>
              <option value="period1">Period 1</option>
              <option value="period2">Period 2</option>
              <option value="period3">Period 3</option>
              <option value="period4">Period 4</option>
              <option value="period5">Period 5</option>
              <option value="period6">Period 6</option>
            </select>
          </div>
        </div>

        <div className="assignment-list-body">
          <div className="assignment-links assignment-section">Links</div>
          <div className="assignment-list assignment-section">Assignment</div>
          <div className="assignment-periods assignment-section">Periods</div>
          <div className="assignment-due assignment-section">Due Date</div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
