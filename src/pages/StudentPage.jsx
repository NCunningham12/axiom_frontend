import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStudent } from "../context/StudentContext";
import "./StudentPage.css";

const formatDueDate = (dateString) => {
  if (!dateString) return "No due date";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

const StudentAssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("todo");

  const { currentStudent } = useStudent();
  const studentId = currentStudent?.id;

  useEffect(() => {
    if (!studentId) {
      setAssignments([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      setAssignments([]);

      try {
        const response = await fetch(
          `http://localhost:5000/api/assignments/student/${studentId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assignments.");
        }

        const data = await response.json();

        if (!cancelled) {
          setAssignments(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAssignments();

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  const isSubmitted = (assignment) =>
    ["submitted", "completed"].includes(assignment.attempt_status);

  const today = new Date();

  const todoAssignments = assignments.filter(
    (assignment) => !isSubmitted(assignment),
  );

  const completedAssignments = assignments.filter(isSubmitted);

  const pastDueAssignments = todoAssignments.filter(
    (assignment) =>
      assignment.due_date && new Date(assignment.due_date) < today,
  );

  const currentAssignments = todoAssignments.filter(
    (assignment) =>
      !assignment.due_date || new Date(assignment.due_date) >= today,
  );

  const sortByDueDate = (a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  };

  pastDueAssignments.sort(sortByDueDate);
  currentAssignments.sort(sortByDueDate);

  const getAssignmentLink = (assignment) =>
    assignment.assignment_type === "skill"
      ? `/students/skill-assignment/${assignment.id}`
      : `/students/assignment/${assignment.id}`;

  const AssignmentCard = ({ assignment, pastDue = false }) => {
    const progress = Math.min(
      100,
      Math.max(0, Number(assignment.completion_percentage) || 0),
    );

    const submitted = isSubmitted(assignment);
    const readyToSubmit = !submitted && progress === 100;
    const notStarted = !assignment.attempt_id;

    const status = submitted
      ? "Submitted"
      : pastDue
        ? "Past Due"
        : readyToSubmit
          ? "Ready to Submit"
          : notStarted
            ? "Not Started"
            : "In Progress";

    const statusClass = submitted
      ? "submitted"
      : pastDue
        ? "past-due"
        : readyToSubmit
          ? "ready"
          : notStarted
            ? "not-started"
            : "in-progress";

    const buttonText = submitted
      ? "Review Assignment"
      : readyToSubmit
        ? "Open & Submit"
        : notStarted
          ? "Start Assignment"
          : "Continue";

    return (
      <div className={`student-assignment-card ${statusClass}`}>
        <div className="student-card-header">
          <div className="student-card-heading">
            <h3>{assignment.assignment_name}</h3>
            <p>
              {assignment.assignment_type === "skill"
                ? "Skill Assignment"
                : "Standard Assignment"}
              <span className="student-card-separator">·</span>
              <span>Due {formatDueDate(assignment.due_date)}</span>
            </p>
          </div>

          <span className={`student-card-badge ${statusClass}`}>{status}</span>
        </div>

        <div className="student-card-progress-label">
          <span>
            {assignment.total_answered || 0} of {assignment.total_problems || 0}{" "}
            questions answered
          </span>
          <strong>{progress}%</strong>
        </div>

        <div className="student-card-progress-track">
          <div
            className={`student-card-progress-fill ${statusClass}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="student-card-footer">
          <Link
            to={getAssignmentLink(assignment)}
            className="student-card-button"
          >
            {buttonText} →
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="student-assignment-list-container">
      <div className="student-assignment-list-wrapper">
        <div className="student-assignment-list-title-section">
          <h1>My Assignments</h1>
          <span className="student-assignment-count">
            {todoAssignments.length} To Do
          </span>
        </div>

        <div className="student-assignment-tabs">
          <button
            className={activeTab === "todo" ? "active" : ""}
            onClick={() => setActiveTab("todo")}
          >
            To Do ({todoAssignments.length})
          </button>

          <button
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedAssignments.length})
          </button>
        </div>

        {!studentId && (
          <p className="student-page-message">
            Select a test student to view assignments.
          </p>
        )}

        {studentId && loading && (
          <p className="student-page-message">Loading assignments...</p>
        )}

        {studentId && error && <p className="student-page-message">{error}</p>}

        {studentId && !loading && !error && activeTab === "todo" && (
          <div className="student-assignment-columns">
            <section className="student-assignment-column">
              <div className="student-column-heading">
                <h2>Current Assignments</h2>
                <span>{currentAssignments.length}</span>
              </div>

              <div className="student-assignment-card-list">
                {currentAssignments.length > 0 ? (
                  currentAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                    />
                  ))
                ) : (
                  <p className="student-column-empty">
                    No current assignments.
                  </p>
                )}
              </div>
            </section>

            <section className="student-assignment-column">
              <div className="student-column-heading past-due-heading">
                <h2>Past Due</h2>
                <span>{pastDueAssignments.length}</span>
              </div>

              <div className="student-assignment-card-list">
                {pastDueAssignments.length > 0 ? (
                  pastDueAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      pastDue
                    />
                  ))
                ) : (
                  <p className="student-column-empty">
                    You're all caught up! 🎉
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {studentId && !loading && !error && activeTab === "completed" && (
          <div className="student-completed-assignments">
            <div className="student-column-heading">
              <h2>Completed Assignments</h2>
              <span>{completedAssignments.length}</span>
            </div>

            <div className="student-assignment-card-list">
              {completedAssignments.length > 0 ? (
                completedAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              ) : (
                <p className="assignment-empty">
                  No submitted assignments yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentList;

// OLD BUILD BELOW //

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useStudent } from '../context/StudentContext';
// import './StudentPage.css';

// const StudentAssignmentList = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { currentStudent } = useStudent();
//   const studentId = currentStudent?.id;

//   useEffect(() => {
//     if (!studentId) {
//       setAssignments([]);
//       setLoading(false);
//       setError(null);
//       return;
//     }

//     let cancelled = false;

//     const fetchAssignments = async () => {
//       setLoading(true);
//       setError(null);
//       setAssignments([]);

//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/assignments/student/${studentId}`,
//         );

//         if (!response.ok) {
//           throw new Error('Failed to fetch assignments.');
//         }

//         const data = await response.json();

//         if (!cancelled) {
//           setAssignments(data);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError(err.message);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchAssignments();

//     return () => {
//       cancelled = true;
//     };
//   }, [studentId]);

//   console.log(assignments);

//   return (
//     <div className="student-assignment-list-container">
//       <div className="student-assignment-list-wrapper">
//         <div className="student-assignment-list-title-section">
//           <h1 className="student-assignment-list-title">Assignments</h1>
//         </div>
//         <div className="student-assignment-list-body">
//           <div className="student-assignment-header-row">
//             <div className="student-assignment-links student-header-section">
//               Assignment
//             </div>
//             <div className="student-assignment-list student-header-section">
//               Assignment Type
//             </div>
//             <div className="student-assignment-periods student-header-section">
//               Status
//             </div>
//             <div className="student-assignment-periods student-header-section">
//               Progress
//             </div>
//             <div className="student-assignment-due student-header-section">
//               Due Date
//             </div>
//           </div>
//           {!studentId && <p>Select a test student to view assignments.</p>}

//           {studentId && loading && <p>Loading assignments...</p>}

//           {studentId && error && <p>{error}</p>}

//           {studentId && !loading && !error && assignments.length === 0 && (
//             <p>No assignments found for this student.</p>
//           )}
//           {studentId &&
//             !loading &&
//             !error &&
//             assignments.map((assignment) => (
//               <div className="student-assignment-row" key={assignment.id}>
//                 <div className="student-assignment-links student-assignment-section">
//                   <Link
//                     to={
//                       assignment.assignment_type === 'skill'
//                         ? `/students/skill-assignment/${assignment.id}`
//                         : `/students/assignment/${assignment.id}`
//                     }
//                     className="student-assignment-title-link"
//                   >
//                     {assignment.assignment_name}
//                   </Link>
//                 </div>

//                 <div className="student-assignment-list student-assignment-section">
//                   {assignment.assignment_type}
//                 </div>

//                 <div className="student-assignment-status student-assignment-section">
//                   {assignment.display_status}
//                 </div>

//                 <div className="student-assignment-completion student-assignment-section">
//                   {assignment.completion_percentage}%
//                 </div>

//                 <div className="student-assignment-due student-assignment-section">
//                   {assignment.due_date}
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentAssignmentList;
