import { useRef, useEffect } from 'react';
import 'mathlive';

export default function MathInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const inputEl = ref.current;
    if (!inputEl) return;

    const handle = (e) => {
      onChange(e.target.value);
      console.log('🧠 Raw MathInput:', e.target.value);
    };

    inputEl.value = value || '';
    inputEl.addEventListener('input', handle);

    return () => {
      inputEl.removeEventListener('input', handle);
    };
  }, [value]); // <--- Only rebind if `value` changes

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
