const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
}) => {
  return (
    <>
      <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}{required && <span style={{ color: "var(--red)" }}> *</span>}
      </label>

      <div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-input text-xs py-1.5"
          style={{ borderColor: error ? "var(--red)" : undefined }}
        >
          <option value="" disabled>Select {label}</option>
          {options.map((opt, index) => {
            const optionKey = typeof opt === "object" ? opt.key : `${opt}-${index}`;
            const optionValue = typeof opt === "object" ? opt.value : opt;
            return (
              <option key={optionKey} value={optionValue}>
                {optionValue}
              </option>
            );
          })}
        </select>
        {error && <p className="text-[10px] mt-0.5" style={{ color: "var(--red)" }}>{error}</p>}
      </div>
    </>
  );
};

export default SelectField;
