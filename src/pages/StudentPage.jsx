import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentPage.css';

const StudentAssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(2);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/assignments/student/${studentId}`,
        );

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
  }, [studentId]);

  console.log(assignments);

  return (
    <div className="student-assignment-list-container">
      <div className="student-assignment-list-wrapper">
        <div className="student-assignment-list-title-section">
          <h1 className="student-assignment-list-title">Assignments</h1>
        </div>
        <div className="student-test-login">
          Student ID:
          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(Number(e.target.value))}
          />
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
              Status
            </div>
            <div className="student-assignment-periods student-header-section">
              Progress
            </div>
            <div className="student-assignment-due student-header-section">
              Due Date
            </div>
          </div>

          {assignments.map((assignment) => (
            <div className="student-assignment-row" key={assignment.id}>
              <div className="student-assignment-links student-assignment-section">
                <Link
                  to={
                    assignment.assignment_type === 'skill'
                      ? `/students/skill-assignment/${assignment.id}`
                      : `/students/assignment/${assignment.id}`
                  }
                  className="student-assignment-title-link"
                >
                  {assignment.assignment_name}
                </Link>
              </div>

              <div className="student-assignment-list student-assignment-section">
                {assignment.assignment_type}
              </div>

              <div className="student-assignment-status student-assignment-section">
                {assignment.display_status}
              </div>

              <div className="student-assignment-completion student-assignment-section">
                {assignment.completion_percentage}%
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
