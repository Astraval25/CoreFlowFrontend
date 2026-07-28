import { useState } from "react";
import { MdBusiness, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";

const WHATSAPP_NUMBER = "919043368684";

const RegisterRequestPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    mobileNumber: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "mobileNumber" ? value.replace(/\D/g, "") : value;

    setFormData((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = [
      "Hello CoreFlow, I would like to request a new account.",
      "",
      `Company Name: ${formData.companyName.trim()}`,
      `Mobile Number: +91 ${formData.mobileNumber.trim()}`,
      "",
      "Please contact me to complete the registration.",
    ].join("\n");

    window.location.assign(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-10">
      <section className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-lg">
        <div className="text-center mb-7">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <MdBusiness size={30} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Request an Account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Share your details and send your registration request through WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="companyName" className="block text-sm text-gray-500 mb-2">
              Company Name
            </label>
            <div className="relative">
              <MdBusiness
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                id="companyName"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                maxLength={100}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm text-gray-500 mb-2">
              Mobile Number
            </label>
            <div className="grid grid-cols-[82px_1fr] gap-3">
              <div className="flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-600">
                +91
              </div>
              <div className="relative">
                <MdPhone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="mobileNumber"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Enter a valid 10-digit mobile number"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 rounded-full font-semibold">
            Send Request on WhatsApp
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/cf/auth/login" className="text-blue-600 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterRequestPage;
