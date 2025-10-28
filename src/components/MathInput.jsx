import { useEffect, useRef } from 'react';
import 'mathlive';

export default function MathInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const inputEl = ref.current;
    if (!inputEl) return;

    // Set the initial value
    inputEl.setValue(value || '', { format: 'latex' });

    // Define event handler to pull raw LaTeX
    const handleInput = () => {
      const latex = inputEl.getValue('latex');
      console.log('🧪 Raw MathInput:', latex);
      onChange(latex);
    };

    // Listen for changes
    inputEl.addEventListener('input', handleInput);

    return () => {
      inputEl.removeEventListener('input', handleInput);
    };
  }, [value]);

  return (
    <math-field
      ref={ref}
      style={{
        width: '30%',
        minHeight: '40px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '8px',
        fontSize: '1.2rem',
      }}
    ></math-field>
  );
}
