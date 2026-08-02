import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Classes.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = (classId) => {
    navigate(`/teachers/classes/rosters/${classId}`);
  };

  if (loading) {
    return (
      <div className="classes-container">
        <h1 className="classes-title">Classes</h1>
        <p>Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="classes-container">
        <h1 className="classes-title">Classes</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="classes-container">
      <h1 className="classes-title">Classes</h1>

      <div className="links">- Add New Class</div>

      <div className="cards">
        {classes.length === 0 ? (
          <p>No classes found.</p>
        ) : (
          classes.map((classItem) => (
            <div
              className="class-card"
              key={classItem.id}
              onClick={() => handleClassClick(classItem.id)}
            >
              <h2 className="card-title">{classItem.class_name}</h2>

              <p className="card-description">
                {classItem.student_count}{' '}
                {Number(classItem.student_count) === 1 ? 'Student' : 'Students'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Classes;
