const InputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "",
  type = "text",
  error,
  regex,
  regexError,
  required = false,
  className = "",
}) => {
  const handleBlur = (e) => {
    if (regex && e.target.value) {
      if (!regex.test(e.target.value.trim())) {
        onBlur?.(name, regexError);
        return;
      }
    }
    onBlur?.(name, "");
  };

  return (
    <>
      <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}{required && <span style={{ color: "var(--red)" }}> *</span>}
      </label>

      <div>
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={handleBlur}
          className={`form-input text-xs py-1.5 ${className}`}
          style={{ borderColor: error ? "var(--red)" : undefined }}
        />
        {error && <p className="text-[10px] mt-0.5" style={{ color: "var(--red)" }}>{error}</p>}
      </div>
    </>
  );
};

export default InputField;
