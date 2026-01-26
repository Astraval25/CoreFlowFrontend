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
      <label className="text-sm font-medium text-gray-700">
        {label} {required && "*"}
      </label>

      <div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-90 px-4 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt, index) => {
            const optionKey = typeof opt === 'object' ? opt.key : `${opt}-${index}`;
            const optionValue = typeof opt === 'object' ? opt.value : opt;
            return (
              <option key={optionKey} value={optionValue}>
                {optionValue}
              </option>
            );
          })}
        </select>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </>
  );
};

export default SelectField;
