import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './sections/NavBar';
import Footer from './sections/Footer';
import AssignmentCreator from './pages/AssignmentCreator';
import SkillsCreator from './pages/SkillsCreator';
import AssignmentEditor from './pages/AssignmentEditor';
import Assignment from './pages/Assignment';
import AssignmentList from './pages/AssignmentList';
import StudentPage from './pages/StudentPage';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div className="main-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teachers/assignment-creator" element={<AssignmentCreator />} />
            <Route path="/teachers/skills-creator" element={<SkillsCreator />} />
            <Route path="/teachers/assignment-editor" element={<AssignmentEditor />} />
            <Route path="/teachers/assignment-list" element={<AssignmentList />} />
            <Route path="/students/assignment" element={<Assignment />} />
            <Route path="/students/student-page" element={<StudentPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
