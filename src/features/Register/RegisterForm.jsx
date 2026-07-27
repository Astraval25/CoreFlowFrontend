import { useState } from "react";
import {
  MdBusiness,
  MdLock,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

const RegisterForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    countryCode: "+91",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }
    if (!/^\+?[0-9]{1,4}$/.test(formData.countryCode.trim())) {
      errors.countryCode = "Enter a valid country code";
    }
    if (!/^[0-9]{6,15}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Phone number must be 6 to 15 digits";
    }
    if (!/^(?=.*[a-z])(?=.*\d).{5,}$/.test(formData.password)) {
      errors.password =
        "Password must be at least 5 characters and include a lowercase letter and a number";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Company</label>
        <div className="relative">
          <MdBusiness
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company name"
            className={`w-full pl-9 pr-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              validationErrors.companyName
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
        </div>
        {validationErrors.companyName && (
          <p className="text-red-500 text-xs mt-1">
            {validationErrors.companyName}
          </p>
        )}
      </div>

      <div className="grid grid-cols-[110px_1fr] gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Country Code
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-full bg-gray-100 text-gray-600">
            +91
          </div>
          {validationErrors.countryCode && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.countryCode}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <MdPhone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              className={`w-full pl-9 pr-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                validationErrors.phoneNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          {validationErrors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.phoneNumber}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Password</label>
        <div className="relative">
          <MdLock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`w-full pl-9 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              validationErrors.password ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <MdVisibilityOff size={18} />
            ) : (
              <MdVisibility size={18} />
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p className="text-red-500 text-xs mt-1">
            {validationErrors.password}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <MdLock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className={`w-full pl-9 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              validationErrors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? (
              <MdVisibilityOff size={18} />
            ) : (
              <MdVisibility size={18} />
            )}
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {validationErrors.confirmPassword}
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-2 rounded text-xs text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2.5 rounded-full font-semibold hover:bg-blue-400 transition text-sm cursor-pointer"
      >
        Sign Up
      </button>
    </form>
  );
};

export default RegisterForm;
