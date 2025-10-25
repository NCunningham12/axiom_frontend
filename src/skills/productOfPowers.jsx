import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import SmartInput from '../components/SmartInput';

// 1. Generator: create the dynamic problem
export function generateProblem() {
  const baseOptions = ['a', 'b', 'x', 'y'];
  const base = baseOptions[Math.floor(Math.random() * baseOptions.length)];

  const m = Math.floor(Math.random() * 5) + 1;
  const n = Math.floor(Math.random() * 5) + 1;
  const total = m + n;

  const question = `${base}^{${m}} \\cdot ${base}^{${n}}`;

  return {
    id: `productOfPowers-${base}${m}${n}`,
    concept: 'exponents',
    type: 'productOfPowers',
    directions: 'Solve the exponent using the Product of Powers Rule.',
    question,
    answer: {
      base,
      exponent: total,
    },
  };
}

// 2. Renderer: visually render the problem
export function renderProblem(studentAnswer, problem, setStudentAnswer) {

  return (
    <div>
      <h3>Product of Powers</h3>
      <p>{problem.directions}</p>
      <InlineMath math={problem.question} />
      <SmartInput
        radical
        exponent
        value={studentAnswer}
        onChange={setStudentAnswer}
      />
    </div>
  );
}

// 3. Validator: check the student's answer
export function validateAnswer(input, problem) {
  const expected = `${problem.answer.base}^${problem.answer.exponent}`;

  // Allow for slight input variation like spacing
  const sanitizedInput = (input || '').replace(/\s+/g, '');

  if (sanitizedInput === expected) {
    return 'correct';
  } else {
    return 'incorrect';
  }
}
