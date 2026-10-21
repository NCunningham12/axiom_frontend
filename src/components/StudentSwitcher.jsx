import { useEffect, useState } from 'react';
import { useStudent } from '../context/StudentContext';

function StudentSwitcher() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const { currentStudent, setCurrentStudent } = useStudent();

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/classes/students'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
        setError('Unable to load students.');
      }
    }

    fetchStudents();
  }, []);

  function handleStudentChange(event) {
    const studentId = Number(event.target.value);

    const selectedStudent = students.find(
      (student) => student.id === studentId
    );

    setCurrentStudent(selectedStudent || null);
  }

  return (
    <div className="student-switcher">
      <label htmlFor="student-select">Test Student: </label>

      <select
        id="student-select"
        value={currentStudent?.id ?? ''}
        onChange={handleStudentChange}
      >
        <option value="">Select a student</option>

        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.firstName} {student.lastName}
            {' — '}
            Classes: {student.classIds.join(', ')}
          </option>
        ))}
      </select>

      {error && <p>{error}</p>}
    </div>
  );
}

export default StudentSwitcher;