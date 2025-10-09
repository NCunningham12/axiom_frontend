import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="" alt="" />
      </Link>
      <ul className="nav-menu">
        <li className="nav-item">Home</li>
        <li className="nav-item">Math</li>
        <li className="nav-item">Teachers</li>
        <li className="nav-item">Tools</li>
        <li className="nav-item">Help</li>
      </ul>
      <Button>Login</Button>
    </nav>
  );
};

export default NavBar;
