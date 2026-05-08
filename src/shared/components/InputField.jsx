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
      <label className="text-[11px] font-semibold uppercase tracking-wide text-app-muted">
        {label}{required && <span className="text-danger"> *</span>}
      </label>

      <div>
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={handleBlur}
          className={`form-input text-xs py-1.5 ${error ? "border-danger" : ""} ${className}`}
        />
        {error && <p className="text-[10px] mt-0.5 text-danger">{error}</p>}
      </div>
    </>
  );
};

export default InputField;
