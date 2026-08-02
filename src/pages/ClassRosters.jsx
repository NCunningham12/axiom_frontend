import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [addStudentError, setAddStudentError] = useState('');
  const [rosterRefreshKey, setRosterRefreshKey] = useState(0);

  const [modalMode, setModalMode] = useState('add');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    username: '',
    classIds: [Number(classId)],
  });

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
  }, [classId, rosterRefreshKey]);

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;

    if (!selectedClassId) {
      return;
    }

    navigate(`/teachers/classes/rosters/${selectedClassId}`);
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedStudentId(null);

    setNewStudent({
      firstName: '',
      lastName: '',
      username: '',
      classIds: [Number(classId)],
    });

    setAddStudentError('');
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (isAddingStudent || isDeletingStudent) {
      return;
    }

    setAddStudentError('');
    setSelectedStudentId(null);
    setShowAddModal(false);
  };

  const handleStudentInputChange = (event) => {
    const { name, value } = event.target;

    setNewStudent((previousStudent) => ({
      ...previousStudent,
      [name]: value,
    }));
  };

  const handleOpenEditModal = async (studentId) => {
    try {
      setModalMode('edit');
      setSelectedStudentId(studentId);
      setAddStudentError('');
      setIsAddingStudent(true);

      const response = await fetch(
        `http://localhost:5000/api/classes/students/${studentId}`,
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to load student.');
      }

      setNewStudent({
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        username: responseData.username,
        classIds: responseData.classIds.map(Number),
      });

      setShowAddModal(true);
    } catch (error) {
      console.error('Failed to load student:', error);
      setAddStudentError(error.message);
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleClassCheckboxChange = (event) => {
    const selectedClassId = Number(event.target.value);
    const isChecked = event.target.checked;

    setNewStudent((previousStudent) => ({
      ...previousStudent,
      classIds: isChecked
        ? [...previousStudent.classIds, selectedClassId]
        : previousStudent.classIds.filter(
            (savedClassId) => savedClassId !== selectedClassId,
          ),
    }));
  };

  const handleStudentSubmit = async (event) => {
    event.preventDefault();

    if (newStudent.classIds.length === 0) {
      setAddStudentError('Select at least one class.');
      return;
    }

    const isEditMode = modalMode === 'edit';

    const url = isEditMode
      ? `http://localhost:5000/api/classes/students/${selectedStudentId}`
      : 'http://localhost:5000/api/classes/students';

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      setIsAddingStudent(true);
      setAddStudentError('');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            `Failed to ${isEditMode ? 'update' : 'add'} student.`,
        );
      }

      setShowAddModal(false);
      setSelectedStudentId(null);

      setNewStudent({
        firstName: '',
        lastName: '',
        username: '',
        classIds: [Number(classId)],
      });

      setRosterRefreshKey((previousKey) => previousKey + 1);
    } catch (error) {
      console.error('Failed to save student:', error);
      setAddStudentError(error.message);
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudentId) {
      setAddStudentError('No student selected.');
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete ${newStudent.firstName} ${newStudent.lastName}?\n\nThis will remove the student from every class.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingStudent(true);
      setAddStudentError('');

      const response = await fetch(
        `http://localhost:5000/api/classes/students/${selectedStudentId}`,
        {
          method: 'DELETE',
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete student.');
      }

      setShowAddModal(false);
      setSelectedStudentId(null);

      setNewStudent({
        firstName: '',
        lastName: '',
        username: '',
        classIds: [Number(classId)],
      });

      setRosterRefreshKey((previousKey) => previousKey + 1);
    } catch (error) {
      console.error('Failed to delete student:', error);
      setAddStudentError(error.message);
    } finally {
      setIsDeletingStudent(false);
    }
  };

  return (
    <div className="rosters-page-container">
      <div className="back-nav">
        <Link className="back-link" to="/teachers/classes">
          &lt; Back
        </Link>
      </div>
      <h1 className="rosters-page-title">
        {currentClass ? `${currentClass.className} Roster` : 'Class Rosters'}
      </h1>

      <div className="dropdown">
        <p>Select Class</p>
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

      <div className="rosters-links">
        <button type="button" className="add-link" onClick={handleOpenAddModal}>
          + Add New Student
        </button>
      </div>

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

                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleOpenEditModal(student.id)}
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseAddModal}>
          <div
            className="student-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="student-modal-title">
              {modalMode === 'edit' ? 'Edit Student' : 'Add Student'}
            </h2>

            <form className="student-form" onSubmit={handleStudentSubmit}>
              <label className="student-form-field">
                <span>First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={newStudent.firstName}
                  onChange={handleStudentInputChange}
                  required
                />
              </label>

              <label className="student-form-field">
                <span>Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={newStudent.lastName}
                  onChange={handleStudentInputChange}
                  required
                />
              </label>

              <label className="student-form-field">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  value={newStudent.username}
                  onChange={handleStudentInputChange}
                  required
                />
              </label>

              <fieldset className="class-checkboxes">
                <legend>Classes</legend>

                {classes.map((classItem) => (
                  <label className="class-checkbox" key={classItem.id}>
                    <input
                      type="checkbox"
                      value={classItem.id}
                      checked={newStudent.classIds.includes(
                        Number(classItem.id),
                      )}
                      onChange={handleClassCheckboxChange}
                    />

                    <span>{classItem.class_name}</span>
                  </label>
                ))}

                {newStudent.classIds.length === 0 && (
                  <p className="modal-error">Select at least one class.</p>
                )}
              </fieldset>

              {addStudentError && (
                <p className="modal-error">{addStudentError}</p>
              )}

              <div className="student-modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={handleCloseAddModal}
                  disabled={isAddingStudent || isDeletingStudent}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-add-btn"
                  disabled={
                    newStudent.classIds.length === 0 ||
                    isAddingStudent ||
                    isDeletingStudent
                  }
                >
                  {isAddingStudent
                    ? modalMode === 'edit'
                      ? 'Saving...'
                      : 'Adding...'
                    : modalMode === 'edit'
                      ? 'Save Changes'
                      : 'Add Student'}
                </button>
              </div>

              {modalMode === 'edit' && (
                <div className="student-danger-zone">
                  <p>Permanently remove this student from Axiom.</p>

                  <button
                    type="button"
                    className="delete-student-btn"
                    onClick={handleDeleteStudent}
                    disabled={isAddingStudent || isDeletingStudent}
                  >
                    {isDeletingStudent ? 'Deleting...' : 'Delete Student'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRosters;
