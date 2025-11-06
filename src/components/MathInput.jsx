import { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';

export default function MathInput({ value, onChange, buttons = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    const inputEl = ref.current;
    if (!inputEl) return;

    inputEl.setValue(value || '', { format: 'latex' });

    const handleInput = () => {
      const latex = inputEl.getValue('latex');
      onChange(latex);
    };

    inputEl.addEventListener('input', handleInput);
    return () => inputEl.removeEventListener('input', handleInput);
  }, [value]);

  const insertLatex = (snippet) => {
    const inputEl = ref.current;
    if (!inputEl) return;

    inputEl.executeCommand('insert', snippet);
    inputEl.focus();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      {buttons.map(({ label, latex }, idx) => (
        <button
          key={idx}
          onClick={() => insertLatex(latex)}
          style={{
            padding: '6px 10px',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #999',
            background: '#eee',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {label}
        </button>
      ))}
      <math-field
        ref={ref}
        style={{
          minHeight: '40px',
          minWidth: '200px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '8px',
          fontSize: '1.2rem',
          flexShrink: 0,
        }}
      ></math-field>
    </div>
  );
}
