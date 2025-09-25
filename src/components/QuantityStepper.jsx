import React from "react";
export default function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 20,
  ariaLabel = "Select quantity",
}) {
  return (
    <div className="stepper" role="group" aria-label={ariaLabel}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="decrease"
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="increase"
      >
        +
      </button>
    </div>
  );
}
