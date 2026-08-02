import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Classes.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [addClassError, setAddClassError] = useState('');

  const [newClass, setNewClass] = useState({
    className: '',
    period: '',
    schoolYear: '2026-2027',
  });

  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      setError('');

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

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenAddModal = () => {
    setNewClass({
      className: '',
      period: '',
      schoolYear: '2026-2027',
    });

    setAddClassError('');
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (isAddingClass) {
      return;
    }

    setAddClassError('');
    setShowAddModal(false);
  };

  const handleClassInputChange = (event) => {
    const { name, value } = event.target;

    setNewClass((previousClass) => ({
      ...previousClass,
      [name]: value,
    }));
  };

  const handleAddClass = async (event) => {
    event.preventDefault();

    try {
      setIsAddingClass(true);
      setAddClassError('');

      const response = await fetch('http://localhost:5000/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create class.');
      }

      setShowAddModal(false);

      setNewClass({
        className: '',
        period: '',
        schoolYear: '2026-2027',
      });

      await fetchClasses();
    } catch (error) {
      console.error('Failed to create class:', error);
      setAddClassError(error.message);
    } finally {
      setIsAddingClass(false);
    }
  };

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

      <div className="links">
        <button type="button" className="add-btn" onClick={handleOpenAddModal}>
          + Add New Class
        </button>
      </div>

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
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseAddModal}>
          <div
            className="class-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="class-modal-title">Add Class</h2>

            <form className="class-form" onSubmit={handleAddClass}>
              <label className="class-form-field">
                <span>Class Name</span>

                <input
                  type="text"
                  name="className"
                  value={newClass.className}
                  onChange={handleClassInputChange}
                  placeholder=""
                  required
                />
              </label>

              <label className="class-form-field">
                <span>Period</span>

                <input
                  type="text"
                  name="period"
                  value={newClass.period}
                  onChange={handleClassInputChange}
                  placeholder=""
                  required
                />
              </label>

              <label className="class-form-field">
                <span>School Year</span>

                <input
                  type="text"
                  name="schoolYear"
                  value={newClass.schoolYear}
                  onChange={handleClassInputChange}
                  placeholder=""
                />
              </label>

              {addClassError && <p className="modal-error">{addClassError}</p>}

              <div className="class-modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={handleCloseAddModal}
                  disabled={isAddingClass}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-add-btn"
                  disabled={isAddingClass}
                >
                  {isAddingClass ? 'Adding...' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
