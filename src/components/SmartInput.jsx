import React, { useRef } from "react";

export default function SmartInput({ radical, exponent, value, onChange }) {
  const inputRef = useRef(null);

  const insertAtCursor = (symbol) => {
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    const newText = text.slice(0, start) + symbol + text.slice(end);
    onChange(newText);
    // Set cursor position after inserted symbol
    setTimeout(() => input.setSelectionRange(start + symbol.length, start + symbol.length), 0);
  };

  return (
    <div className="smart-input-container">
      <input
        ref={inputRef}
        className="smart-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {radical && (
        <button
          type="button"
          className="smart-input-button"
          onClick={() => insertAtCursor("√")}
        >
          √
        </button>
      )}

      {exponent && (
        <button
          type="button"
          className="smart-input-button"
          onClick={() => insertAtCursor("ⁿ")}
        >
          xⁿ
        </button>
      )}
    </div>
  );
}
