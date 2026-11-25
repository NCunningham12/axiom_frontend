import { useEffect, useRef } from "react";
import { MathfieldElement } from "mathlive";

export default function MathInput({
  value,
  onChange,
  buttons = [],
  onInsertLatex,
  onSubmit,
  readOnly = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const inputEl = ref.current;
    if (!inputEl) return;

    inputEl.readOnly = readOnly;

    inputEl.mathVirtualKeyboardPolicy = readOnly ? "manual" : "auto";
  }, [readOnly]);

  useEffect(() => {
    const inputEl = ref.current;
    if (!inputEl) return;

    inputEl.setValue(value || "", { format: "latex" });

    const handleInput = () => {
      if (readOnly) return;

      const latex = inputEl.getValue("latex");
      onChange(latex);
    };

    inputEl.addEventListener("input", handleInput);

    return () => inputEl.removeEventListener("input", handleInput);
  }, [value, readOnly, onChange]);

  useEffect(() => {
    const inputEl = ref.current;
    if (!inputEl || readOnly) return;

    inputEl.focus();
  }, [readOnly]);

  useEffect(() => {
    const inputEl = ref.current;
    if (!inputEl) return;

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();

        if (!readOnly) {
          onSubmit?.();
        }
      }
    };

    inputEl.addEventListener("keydown", handleKeyDown, true);

    return () => inputEl.removeEventListener("keydown", handleKeyDown, true);
  }, [onSubmit, readOnly]);

  const insertLatex = (snippet) => {
    const inputEl = ref.current;
    if (!inputEl || readOnly) return;

    inputEl.executeCommand("insert", snippet);
    inputEl.focus();
  };

  useEffect(() => {
    if (onInsertLatex) {
      onInsertLatex(insertLatex);
    }
  }, [onInsertLatex, readOnly]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        flexWrap: "wrap",
      }}
    >
      {!readOnly &&
        buttons.map(({ label }, idx) => (
          <div
            key={idx}
            className="math-button-wrapper"
            style={{
              marginRight: "8px",
              display: "inline-block",
            }}
          >
            {label}
          </div>
        ))}

      <math-field
        ref={ref}
        style={{
          minHeight: "40px",
          minWidth: "200px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "8px",
          fontSize: "1.2rem",
          flexShrink: 0,
        }}
      ></math-field>
    </div>
  );
}
