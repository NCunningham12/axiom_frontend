import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import MathInput from '../../components/MathInput';
import '../../pages/AssignmentEditor.css';

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
  let insertLatexFn = () => {};

  const buttons = [
    {
      label: (
        <math-field
          class="mathlive-placeholder-button"
          read-only
          virtual-keyboard-mode="off"
          onClick={() => insertLatexFn('^\\placeholder{}')}
        >
          {'x^{\\placeholder{}}'}
        </math-field>
      ),
    },
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
        onInsertLatex={(fn) => {
          insertLatexFn = fn;
        }}
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
    .replace(/\\ /g, '') // remove stray backslashes with space
    .replace(/\s+/g, '') // remove all whitespace
    .replace(/\^\{(\d+)\}/g, '^$1') // convert ^{10} to ^10 for consistency
    .toLowerCase(); // make case-insensitive
}

export function validateAnswer(input, problem) {
  console.log('🔍 validateAnswer called');

  const expectedBase = `${problem.answer.base}`;
  const expectedExponent = `${problem.answer.exponent}`;
  const expected = `${expectedBase}^${expectedExponent}`;

  const sanitized = sanitizeMathInput(input);

  console.log('Expected: ', expected);
  console.log('Sanitized: ', sanitized);

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

// 4. Editor Interface
export function problemEditor() {
  const [maxExponent, setMaxExponent] = useState(5);

  return (
    <div className="editor-grid">
      <div className="left-pane">
        <h4 className="pane-header">Editor</h4>

        {/* Number of Terms (still radios since it's mutually exclusive) */}
        <fieldset className="input-form">
          <legend>Number of Terms</legend>
          <label>
            <input type="radio" name="terms" value="2" /> 2
          </label>
          <label>
            <input type="radio" name="terms" value="3" /> 3
          </label>
          <label>
            <input type="radio" name="terms" value="4" /> 4
          </label>
        </fieldset>

        {/* Base Type (radio — still mutually exclusive) */}
        <fieldset className="input-form">
          <legend>Base Type</legend>
          <label>
            <input type="radio" name="baseType" value="numeric" /> Numeric Only
          </label>
          <label>
            <input type="radio" name="baseType" value="variable" /> Variable
            Only
          </label>
          <label>
            <input type="radio" name="baseType" value="mixed" /> Mixed
          </label>
        </fieldset>

        {/* Include Fractional Exponents */}
        <fieldset className="input-form">
          <label htmlFor="maxExponent">Max Exponent: {maxExponent}</label>
          <input
            type="range"
            id="maxExponent"
            name="maxExponent"
            min="1"
            max="10"
            step="1"
            list="tickmarks"
            value={maxExponent}
            onChange={(e) => setMaxExponent(Number(e.target.value))}
          />
        </fieldset>

        {/* Include Coefficients */}
        <fieldset className="input-form">
          <label>
            <input type="checkbox" name="coefficients" />
            Include Coefficients
          </label>
        </fieldset>

        {/* Include Negative Exponents */}
        <fieldset className="input-form">
          <label>
            <input type="checkbox" name="negatives" />
            Include Negative Exponents
          </label>
        </fieldset>

        {/* Allow Negative Bases */}
        <fieldset className="input-form">
          <label>
            <input type="checkbox" name="negBase" />
            Allow Negative Bases
          </label>
        </fieldset>
        <button className="apply-button">
          Apply changes to all problems of same type
        </button>
      </div>

      <div className="right-pane">
        <h4 className="pane-header">Live Preview</h4>
        {/* Render preview of the generated problem here */}
      </div>
    </div>
  );
}
