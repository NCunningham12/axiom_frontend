import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './sections/NavBar';
import Footer from './sections/Footer';
import AssignmentCreator from './pages/AssignmentCreator';
import AssignmentEditor from './pages/AssignmentEditor';
import Assignment from './pages/Assignment';
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
            <Route path="/teachers/assignment-editor" element={<AssignmentEditor />} />
            <Route path="/students/assignment" element={<Assignment />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
