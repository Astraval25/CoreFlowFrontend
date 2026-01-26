const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  error,
  required = false,
  rows = 3,
}) => {
  return (
    <>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div>
        <textarea
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          rows={rows}
          className={`w-90 px-4 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
              ${error ? "border-red-500" : "border-gray-300"}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </>
  );
};

export default TextArea;