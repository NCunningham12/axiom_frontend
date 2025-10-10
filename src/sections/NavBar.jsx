import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './Navbar.css';

const NavBar = () => {
  return (
    <div className="nav-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img className="navbar-logo" src="/images.png" alt="" />
          </Link>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">Home</li>
          <li className="nav-item">Math</li>
          <li className="nav-item">Teachers</li>
          <li className="nav-item">Tools</li>
          <li className="nav-item">Help</li>
        </ul>

        <div className="navbar-right">
          <Button>Login</Button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
