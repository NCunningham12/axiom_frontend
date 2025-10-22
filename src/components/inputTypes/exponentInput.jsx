import React from 'react';

const ExponentInput = ({ baseInput, setBaseInput, expInput, setExpInput }) => {
  return (
    <div className="math-input-group">
      <input
        type="text"
        className="base-input"
        value={baseInput}
        onChange={(e) => setBaseInput(e.target.value)}
      />
      <input
        type="text"
        className="exponent-input"
        value={expInput}
        onChange={(e) => setExpInput(e.target.value)}
      />
    </div>
  );
};

export default ExponentInput;
