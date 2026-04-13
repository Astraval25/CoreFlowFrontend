import { useEffect, useRef, useState } from "react";

const StyledDropdown = ({
  value,
  onChange,
  options = [],
  disabled = false,
  className = "",
  minWidth = 150,
  menuMinWidth = 170,
}) => {
  const [open, setOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className="text-xs font-medium pl-3 pr-8 py-1.5 rounded-xl transition-all"
        style={{
          border: "1px solid var(--line)",
          color: disabled ? "var(--text-muted)" : "var(--text-main)",
          background: "var(--surface-bg)",
          boxShadow: "var(--shadow-xs)",
          cursor: disabled ? "not-allowed" : "pointer",
          minWidth,
          textAlign: "left",
        }}
      >
        {selectedLabel}
      </button>
      <span
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px]"
        style={{ color: "var(--text-sub)" }}
      >
        {open ? "▴" : "▾"}
      </span>

      {open && !disabled && (
        <div
          className="absolute right-0 mt-1 w-full rounded-xl py-1 z-20"
          style={{
            minWidth: menuMinWidth,
            border: "1px solid var(--line)",
            background: "var(--surface-bg)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {options.map((opt) => {
            const isActive = opt.value === value;
            const isHovered = hoveredOption === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setHoveredOption("");
                }}
                onMouseEnter={() => setHoveredOption(opt.value)}
                onMouseLeave={() => setHoveredOption("")}
                className="w-full text-left px-1.5 py-1 text-xs transition-colors"
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-main)",
                  background: isActive || isHovered ? "var(--surface-soft)" : "var(--surface-bg)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StyledDropdown;
