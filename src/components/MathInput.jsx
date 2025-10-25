// MathInput.jsx
import { useRef, useEffect } from 'react';
import 'mathlive';

export default function MathInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value || '';
      ref.current.addEventListener('input', (e) => {
        onChange(e.target.value);
      });
    }

    // Cleanup
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('input', onChange);
      }
    };
  }, [ref.current]);

  return (
    <math-field
      ref={ref}
      style={{
        width: '100%',
        minHeight: '40px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '8px',
        fontSize: '1.2rem',
      }}
    ></math-field>
  );
}
