const RadioButton = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  error,
}) => {
  return (
    <>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="w-90 py-1.5">
        <div className="flex gap-4">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </>
  );
};

export default RadioButton;
