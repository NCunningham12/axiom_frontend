import React from 'react';
import './Classes.css';

const Classes = () => {
  return (
    <div className="classes-container">
      <h1 className="classes-title">Classes</h1>
      <div className="links">
        - Link 1 <br />
        - Link 2 <br />
        - Link 3 <br />
      </div>
      <div className="cards">
        <div className="class-card">Card 1</div>
        <div className="class-card">Card 2</div>
        <div className="class-card">Card 3</div>
        <div className="class-card">Card 4</div>
        <div className="class-card">Card 5</div>
        <div className="class-card">Card 6</div>
      </div>
    </div>
  );
};

export default Classes;
