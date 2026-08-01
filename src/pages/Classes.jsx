import React from 'react';
import './Classes.css';

const Classes = () => {
  return (
    <div className="classes-container">
      <h1 className="classes-title">Classes</h1>
      <div className="links">
        - Add New Class    
      </div>
      <div className="cards">
        <div className="class-card">
          <h2 className="card-title">Advisory</h2>
          <p className="card-description">32 Students</p>
        </div>
        <div className="class-card">
          <h2 className="card-title">Period 1</h2>
          <p className="card-description">32 Students</p>
        </div>
        <div className="class-card">
          <h2 className="card-title">Period 2</h2>
          <p className="card-description">32 Students</p>
        </div>
        <div className="class-card">
          <h2 className="card-title">Period 3</h2>
          <p className="card-description">32 Students</p>
        </div>
        <div className="class-card">
          <h2 className="card-title">Period 4</h2>
          <p className="card-description">32 Students</p>
        </div>
        <div className="class-card">
          <h2 className="card-title">Period 5</h2>
          <p className="card-description">32 Students</p>
        </div>
      </div>
    </div>
  );
};

export default Classes;
