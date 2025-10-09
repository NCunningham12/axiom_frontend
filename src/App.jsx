import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './sections/NavBar';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" Component={Home} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
