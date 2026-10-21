import { createContext, useContext, useState } from 'react';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [currentStudent, setCurrentStudent] = useState(null);

  return (
    <StudentContext.Provider
      value={{ currentStudent, setCurrentStudent }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error('useStudent must be used inside StudentProvider');
  }

  return context;
}