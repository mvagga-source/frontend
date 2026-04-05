
import "./AButton.css"

export default function AButton({
  children,
  variant = "primary",   // primary | secondary | ghost
  status,                // ongoing | ended | upcoming
  size = "md",           // sm | md | lg
  onClick,
  disabled = false,
  className = ""
}) {
  return (
    <button
      className={`ab-btn ab-btn--${variant} ab-btn--${size} ${status ? `ab-btn--${status}` : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}