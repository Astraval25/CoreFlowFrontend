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
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div>
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={handleBlur}
          className={`w-90 px-4 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500" : "border-gray-300"}
              ${className}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </>
  );
};

export default InputField;
