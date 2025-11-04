import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import AxiomALogo from '../assets/Axiom_A_Glow.png';
import './Navbar.css';
import path from 'path';

const NavBar = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (label) => {
    setOpenCategory((prev) => (prev === label ? null : label));
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Students ▼',
      children: [
        {
          label: 'Assignments',
          path: '/students/assignment',
        },
        {
          label: 'Practice',
          path: '/students/practice',
        },
      ],
    },
    {
      label: 'Teachers ▼',
      children: [
        {
          label: 'Create Assignment',
          path: '/teachers/assignment-creator',
        },
        {
          label: 'Assignments',
          path: '/teachers/assignments',
        },
        {
          label: 'Classes',
          path: '/teachers/classes',
        },
        {
          label: 'Random Student Caller',
          children: '/teacher/rsc',
        },
      ],
    },
    {
      label: 'Extra ▼',
      children: [],
    },
  ];

  return (
    <div className="nav-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img className="navbar-logo" src={AxiomALogo} alt="" />
          </Link>
        </div>

        <div className="nav-menu">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <a
                    className="nav-item"
                    onClick={() => toggleCategory(item.label)}
                  >
                    {item.label}
                  </a>

                  {openCategory === item.label && (
                    <div className="submenu">
                      {item.children.map((child) => (
                        <a className='submenu-item' key={child.label} href={child.path}>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
              </>
            ) : (
                <a href={item.path} className="nav-item">
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="navbar-right">
          <Button>Login</Button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
