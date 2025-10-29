import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import MathInput from '../components/MathInput';

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
export function renderProblem(userAnswer, problem, handleInputChange, index) {
  const buttons = [
    { label: '^', latex: '^{$$}' }, // Cursor will land inside braces
  ];

  return (
    <div className="problem-section-render">
      <h3>Product of Powers</h3>
      <p>{problem.directions}</p>
      <InlineMath math={problem.question} />
      <MathInput
        value={userAnswer}
        onChange={(val) => {
          handleInputChange(index, val);
        }}
        buttons={buttons}
      />
    </div>
  );
}

// 3. Validator: check the student's answer
function sanitizeMathInput(input) {
  console.log('input is: ', input);
  if (!input) {
    console.warn('No input provided to validator');
    return 'incorrect';
  }
  return (input || '')
    .replace(/\\text\{(.*?)\}/g, '$1') // convert \text{x} to x
    .replace(/\\?/g, '') // remove backslashes
    .replace(/\s+/g, '') // remove all whitespace
    .toLowerCase(); // make case-insensitive
}

export function validateAnswer(input, problem) {
  console.log('🔍 validateAnswer called');

  const expectedBase = `${problem.answer.base}`;
  const expectedExponent = `${problem.answer.exponent}`;
  const expected = `${expectedBase}^${expectedExponent}`;

  const sanitized = sanitizeMathInput(input);

  if (sanitized === expected) {
    return 'correct';
  }

  if (sanitized.includes(expectedBase) && sanitized.includes('^')) {
    return 'partial'; // base is right, something’s off with exponent
  }

  if (sanitized.includes(expectedExponent) && sanitized.includes('^')) {
    return 'partial';
  }

  return 'incorrect';
}
