import { useNavigate, useLocation } from "react-router-dom";
import useCreateCustomer from "../hooks/useCreateCustomer.js";

const CreateCustomerPage = () => {
  const { state } = useLocation();
  const customerId = state?.customerId;
  const isEditMode = !!customerId;
  const navigate = useNavigate();

  const {
    formData,
    errors,
    loading,
    sameAsBilling,
    handleChange: originalHandleChange,
    handleSameAsBilling,
    submitCustomer,
  } = useCreateCustomer(customerId);

  // Wrap the original handleChange to ensure it updates only the specific field
  const handleChange = (e) => {
    const { name, value } = e.target;
    originalHandleChange({ target: { name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitCustomer();
  if (success) {
    navigate("/admin/customers");
  }
  };

  const languageOptions = ["English", "Tamil", "Hindi", "Malayalam", "Telugu"];
  const countryOptions = [
    "United States",
    "India",
    "Canada",
    "Australia",
    "United Kingdom",
  ];

  return (
    <div className="p-6">
      <h1 className="font-semibold text-lg mb-6">
        {isEditMode ? "Edit Customer" : "New Customer"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-[180px_1fr] gap-x-6 gap-y-4 items-center max-w-3xl">
          {/* Customer Name */}
          <label className="text-sm font-medium text-gray-700">
            Customer Name *
          </label>
          <div>
            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter Customer Name"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Display Name */}
          <label className="text-sm font-medium text-gray-700">
            Display Name *
          </label>
          <div>
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter Display Name"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.displayName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
            )}
          </div>

          {/* Email */}
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleChange}
              placeholder="Enter Email"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <div>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleChange}
              placeholder="Enter Phone"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Language Dropdown */}
          <label className="text-sm font-medium text-gray-700">Language</label>
          <div>
            <select
              name="lang"
              value={formData.lang}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Language
              </option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* PAN */}
          <label className="text-sm font-medium text-gray-700">PAN</label>
          <div>
            <input
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              onBlur={handleChange}
              placeholder="Enter PAN Number"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pan ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.pan && (
              <p className="text-red-500 text-xs mt-1">{errors.pan}</p>
            )}
          </div>

          {/* GST */}
          <label className="text-sm font-medium text-gray-700">GST</label>
          <div>
            <input
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              onBlur={handleChange}
              placeholder="Enter GST Number"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gst ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.gst && (
              <p className="text-red-500 text-xs mt-1">{errors.gst}</p>
            )}
          </div>

          {/* Advance Amount */}
          <label className="text-sm font-medium text-gray-700">
            Advance Amount
          </label>
          <input
            name="advanceAmount"
            type="number"
            value={formData.advanceAmount}
            onChange={handleChange}
            placeholder="Enter Advance Amount"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Billing & Shipping */}
        <div className="mt-8 grid grid-cols-2 gap-10">
          {/* Billing */}
          <div>
            <h3 className="font-medium text-md mb-4 text-blue-600">
              Billing Address
            </h3>
            <div className="grid grid-cols-[180px_1fr] gap-y-4 items-center">
              <label>Attention Name</label>
              <div>
                <input
                  name="billingAddress.attentionName"
                  value={formData.billingAddress.attentionName}
                  onChange={handleChange}
                  placeholder="Attention Name"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["billingAddress.attentionName"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["billingAddress.attentionName"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["billingAddress.attentionName"]}
                  </p>
                )}
              </div>

              <label>Country</label>
              <div>
                <select
                  name="billingAddress.country"
                  value={formData.billingAddress.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <label>Line 1</label>
              <input
                name="billingAddress.line1"
                value={formData.billingAddress.line1}
                onChange={handleChange}
                placeholder="Line 1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Line 2</label>
              <input
                name="billingAddress.line2"
                value={formData.billingAddress.line2}
                onChange={handleChange}
                placeholder="Line 2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>City</label>
              <input
                name="billingAddress.city"
                value={formData.billingAddress.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>State</label>
              <input
                name="billingAddress.state"
                value={formData.billingAddress.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Pincode</label>
              <div>
                <input
                  name="billingAddress.pincode"
                  value={formData.billingAddress.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["billingAddress.pincode"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["billingAddress.pincode"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["billingAddress.pincode"]}
                  </p>
                )}
              </div>

              <label>Phone</label>
              <div>
                <input
                  name="billingAddress.phone"
                  value={formData.billingAddress.phone}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Phone"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["billingAddress.phone"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["billingAddress.phone"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["billingAddress.phone"]}
                  </p>
                )}
              </div>

              <label>Email</label>
              <div>
                <input
                  name="billingAddress.email"
                  value={formData.billingAddress.email}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Email"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["billingAddress.email"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["billingAddress.email"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["billingAddress.email"]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="font-medium text-md text-green-600">
                Shipping Address
              </h3>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => handleSameAsBilling(e.target.checked)}
                  className="rounded"
                />
                Same as Billing Address
              </label>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-y-4 items-center">
              <label>Attention Name</label>
              <div>
                <input
                  name="shippingAddress.attentionName"
                  value={formData.shippingAddress.attentionName}
                  onChange={handleChange}
                  placeholder="Attention Name"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["shippingAddress.attentionName"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["shippingAddress.attentionName"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["shippingAddress.attentionName"]}
                  </p>
                )}
              </div>

              <label>Country</label>
              <div>
                <select
                  name="shippingAddress.country"
                  value={formData.shippingAddress.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <label>Line 1</label>
              <input
                name="shippingAddress.line1"
                value={formData.shippingAddress.line1}
                onChange={handleChange}
                placeholder="Line 1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Line 2</label>
              <input
                name="shippingAddress.line2"
                value={formData.shippingAddress.line2}
                onChange={handleChange}
                placeholder="Line 2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>City</label>
              <input
                name="shippingAddress.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>State</label>
              <input
                name="shippingAddress.state"
                value={formData.shippingAddress.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Pincode</label>
              <div>
                <input
                  name="shippingAddress.pincode"
                  value={formData.shippingAddress.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["shippingAddress.pincode"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["shippingAddress.pincode"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["shippingAddress.pincode"]}
                  </p>
                )}
              </div>

              <label>Phone</label>
              <div>
                <input
                  name="shippingAddress.phone"
                  value={formData.shippingAddress.phone}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Phone"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["shippingAddress.phone"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["shippingAddress.phone"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["shippingAddress.phone"]}
                  </p>
                )}
              </div>

              <label>Email</label>
              <div>
                <input
                  name="shippingAddress.email"
                  value={formData.shippingAddress.email}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Email"
                  className={`w-full px-4 py-2.5 border rounded-lg ${
                    errors["shippingAddress.email"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["shippingAddress.email"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["shippingAddress.email"]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded cursor-pointer"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Customer"
              : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerPage;
