import { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";

const VerifyOtpForm = ({ onSubmit, onResend, error, prefilledEmail  }) => {
  const [formData, setFormData] = useState({
    email: prefilledEmail || "",
    otp: "",
  });
  const isEmailLocked = Boolean(prefilledEmail);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-sm text-gray-500 mb-2">Email</label>
        <div className="relative">
          <MdEmail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isEmailLocked}
            className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                isEmailLocked
                  ? "bg-slate-50 cursor-not-allowed border-gray-300"
                  : "border-gray-300"
              }
            `}
            required
          />
        </div>
      </div>

      {/* OTP */}
      <div>
        <label className="block text-sm text-gray-500 mb-2">OTP</label>
        <div className="relative">
          <MdLock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest text-center"
            required
          />
        </div>
      </div>

      <div className="text-right text-sm">
        <button
          type="button"
          onClick={() => onResend(formData.email)}
          disabled={!formData.email}
          className="text-blue-600 hover:underline disabled:text-gray-400"
        >
          Resend OTP
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-2 rounded text-sm text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-400 transition"
      >
        Verify OTP
      </button>
    </form>
  );
};

export default VerifyOtpForm;
