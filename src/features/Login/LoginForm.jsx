import { useState } from "react";
import {
  MdLock,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

const LoginForm = ({ onSubmit, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: "+91",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-[105px_1fr] gap-3">
        <div>
          <label className="block text-sm text-gray-500 mb-3">Code</label>
          <div className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-100 text-gray-600">
            +91
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-3">
            Phone Number
          </label>
          <div className="relative">
            <MdPhone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              pattern="[0-9]{6,15}"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-3">Password</label>
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
            placeholder="Enter password"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
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
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-2 rounded text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-400 transition"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
};

export default LoginForm;
