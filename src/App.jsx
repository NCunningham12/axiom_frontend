import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './sections/NavBar';
import Footer from './sections/Footer';
import AssignmentCreator from './pages/AssignmentCreator';
import AssignmentEditor from './pages/AssignmentEditor';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div className="main-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assignment-creator" element={<AssignmentCreator />} />
            <Route path="/assignment-editor" element={<AssignmentEditor />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
