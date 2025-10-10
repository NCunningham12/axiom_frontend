import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './sections/NavBar';
import "./App.css"

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div className="main-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
