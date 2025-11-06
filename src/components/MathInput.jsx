import { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';

export default function MathInput({
  value,
  onChange,
  buttons = [],
  onInsertLatex,
}) {
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

  useEffect(() => {
    if (onInsertLatex) {
      onInsertLatex(insertLatex);
    }
  }, [onInsertLatex]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      {buttons.map(({ label }, idx) => (
        <div
          key={idx}
          className="math-button-wrapper"
          style={{ marginRight: '8px', display: 'inline-block' }}
        >
          {label}
        </div>
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
