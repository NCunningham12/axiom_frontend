import React, { useEffect, useState } from 'react';
import './AssignmentList.css';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/assignments');

        if (!response.ok) {
          throw new Error('Failed to fetch assignments.');
        }

        const data = await response.json();

        setAssignments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  console.log(assignments);

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
          <div className="assignment-header-row">
            <div className="assignment-links header-section">
              Assignment
            </div>
            <div className="assignment-list header-section">
              Assignment Type
            </div>
            <div className="assignment-periods header-section">Periods</div>
            <div className="assignment-periods header-section">Folder</div>
            <div className="assignment-due header-section">Due Date</div>
          </div>

          {assignments.map((assignment) => (
            <div className="assignment-row" key={assignment.id}>
              <div className="assignment-links assignment-section">
                {assignment.assignment_name}
              </div>

              <div className="assignment-list assignment-section">
                {assignment.assignment_type}
              </div>

              <div className="assignment-periods assignment-section">
                {assignment.periods}
              </div>

              <div className="assignment-periods assignment-section">
                {assignment.folder}
              </div>

              <div className="assignment-due assignment-section">
                {assignment.due_date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
