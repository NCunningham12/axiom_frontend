import React, { useEffect, useState } from 'react';
import './Scores.css';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [assignments, setAssignments] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const params = new URLSearchParams();

        if (selectedAssignment !== 'all') {
          params.append('assignmentId', selectedAssignment);
        }

        if (selectedPeriod !== 'all') {
          params.append('period', selectedPeriod);
        }

        const url = `http://localhost:5000/api/attempts/scores?${params.toString()}`;

        const response = await fetch(url);

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
  }, [selectedAssignment, selectedPeriod]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/assignments');

        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }

        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="scores-container">
      <h1 className="scores-title">Scores</h1>
      <div className="scores-tools">Tools</div>

      <div className="scores-filters">
        <div className="scores-filter-group">
          <select
            id="assignment-filter"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option value="all">All Assignments</option>

            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.assignment_name}
              </option>
            ))}
          </select>
        </div>

        <div className="scores-filter-group">
          <label htmlFor="period-filter">Class Period</label>
          <select
            id="period-filter"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="all">All Periods</option>
            {[1, 2, 3, 4, 5, 6].map((period) => (
              <option key={period} value={`Period ${period}`}>
                Period {period}
              </option>
            ))}
          </select>
        </div>

        <div className="scores-filter-group">
          <label htmlFor="completion-filter">Completion</label>
          <select id="completion-filter" defaultValue="all">
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Not Started</option>
          </select>
        </div>

        <div className="scores-filter-group">
          <label htmlFor="sort-filter">Sort By</label>
          <select id="sort-filter" defaultValue="last-name">
            <option value="last-name">Last Name</option>
            <option value="first-name">First Name</option>
            <option value="score-high">Score: High to Low</option>
            <option value="score-low">Score: Low to High</option>
            <option value="completion">Completion</option>
            <option value="time">Time Spent</option>
          </select>
        </div>
      </div>

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
                {attempt.student_period ?? 'Unassigned'}
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
