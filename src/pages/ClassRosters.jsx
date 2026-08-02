import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ClassRosters.css';

const ClassRosters = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [students, setStudents] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [error, setError] = useState('');

  // Fetch the class list once for the dropdown.
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes');

        if (!response.ok) {
          throw new Error('Failed to fetch classes.');
        }

        const classData = await response.json();
        setClasses(classData);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        setError(error.message);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch a new roster whenever the class ID in the URL changes.
  useEffect(() => {
    const fetchRoster = async () => {
      try {
        setLoadingRoster(true);
        setError('');

        const response = await fetch(
          `http://localhost:5000/api/classes/${classId}/students`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch class roster.');
        }

        const rosterData = await response.json();

        setCurrentClass(rosterData.class);
        setStudents(rosterData.students);
      } catch (error) {
        console.error('Failed to fetch class roster:', error);
        setError(error.message);
        setCurrentClass(null);
        setStudents([]);
      } finally {
        setLoadingRoster(false);
      }
    };

    fetchRoster();
  }, [classId]);

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;

    if (!selectedClassId) {
      return;
    }

    navigate(`/teachers/classes/rosters/${selectedClassId}`);
  };

  return (
    <div className="rosters-page-container">
      <h1 className="rosters-page-title">
        {currentClass ? `${currentClass.className} Roster` : 'Class Rosters'}
      </h1>

      <div className="dropdown">
        <select
          name="select-class"
          id="select-class"
          className="select-class"
          value={classId}
          onChange={handleClassChange}
          disabled={loadingClasses}
        >
          <option value="">Select Class</option>

          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.class_name}
            </option>
          ))}
        </select>
      </div>

      <div className="rosters-links">Links</div>

      {error && <p>{error}</p>}

      {loadingRoster ? (
        <p>Loading roster...</p>
      ) : (
        <div className="roster-wrapper">
          <div className="roster-line">
            <div className="roster-categories">
              <div className="roster-id roster-item">ID#</div>
              <div className="roster-last roster-item">Last</div>
              <div className="roster-first roster-item">First</div>
              <div className="roster-class roster-item">Class</div>
              <div className="roster-username roster-item">Username</div>
            </div>

            <div className="edit-space" />
          </div>

          {students.length === 0 ? (
            <p>No students enrolled in this class.</p>
          ) : (
            students.map((student) => (
              <div className="roster-line student-row" key={student.id}>
                <div className="roster-row">
                  <div className="roster-id roster-item">{student.id}</div>

                  <div className="roster-last roster-item">
                    {student.lastName}
                  </div>

                  <div className="roster-first roster-item">
                    {student.firstName}
                  </div>

                  <div className="roster-class roster-item">
                    {currentClass?.className}
                  </div>

                  <div className="roster-username roster-item">
                    {student.username}
                  </div>
                </div>

                <button className="edit-btn">Edit</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClassRosters;
