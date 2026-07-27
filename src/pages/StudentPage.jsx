import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentPage.css';

const StudentAssignmentList = () => {
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
    <div className="student-assignment-list-container">
      <div className="student-assignment-list-wrapper">
        <div className="student-assignment-list-title-section">
          <h1 className="student-assignment-list-title">Assignments</h1>
        </div>

        <div className="student-assignment-list-body">
          <div className="student-assignment-header-row">
            <div className="student-assignment-links student-header-section">
              Assignment
            </div>
            <div className="student-assignment-list student-header-section">
              Assignment Type
            </div>
            <div className="student-assignment-periods student-header-section">
              Periods
            </div>
            <div className="student-assignment-periods student-header-section">
              Folder
            </div>
            <div className="student-assignment-due student-header-section">
              Due Date
            </div>
          </div>

          {assignments.map((assignment) => (
            <div className="student-assignment-row" key={assignment.id}>
              <div className="student-assignment-links student-assignment-section">
                <Link
                  to={`/students/assignment/${assignment.id}`}
                  className="student-assignment-title-link"
                >
                  {assignment.assignment_name}
                </Link>
              </div>

              <div className="student-assignment-list student-assignment-section">
                {assignment.assignment_type}
              </div>

              <div className="student-assignment-periods student-assignment-section">
                {assignment.periods}
              </div>

              <div className="student-assignment-periods student-assignment-section">
                {assignment.folder}
              </div>

              <div className="student-assignment-due student-assignment-section">
                {assignment.due_date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentList;
