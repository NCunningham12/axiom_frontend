import React from 'react';
import './Assignment.css';
import { InlineMath, BlockMath } from 'react-katex';
import { useLocation } from 'react-router-dom';

const Assignment = () => {
  const { state } = useLocation();
  const assignment = state?.assignment;

  return (
    <div>
      <h2>{assignment?.title}</h2>
      {assignment?.problems?.length > 0 && (
        <BlockMath math={assignment.problems[0].question} />
      )}
    </div>
  );
};

export default Assignment;
