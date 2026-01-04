import { useSearchParams } from "react-router-dom";
import useCreateCustomer from "../hooks/useCreateCustomer.js";

const CreateCustomerPage = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const isEditMode = !!customerId;

  const {
    formData,
    errors,
    loading,
    sameAsBilling,
    handleChange,
    handleSameAsBilling,
    submitCustomer,
  } = useCreateCustomer(customerId);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCustomer();
  };

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
              placeholder="Enter Phone"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Language */}
          <label className="text-sm font-medium text-gray-700">Language</label>
          <input
            name="lang"
            value={formData.lang}
            onChange={handleChange}
            placeholder="Enter Language"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PAN */}
          <label className="text-sm font-medium text-gray-700">PAN</label>
          <div>
            <input
              name="pan"
              value={formData.pan}
              onChange={handleChange}
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
              <input
                name="billingAddress.attentionName"
                value={formData.billingAddress.attentionName}
                onChange={handleChange}
                placeholder="Attention Name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Country</label>
              <input
                name="billingAddress.country"
                value={formData.billingAddress.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

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
              <input
                name="billingAddress.pincode"
                value={formData.billingAddress.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Phone</label>
              <div>
                <input
                  name="billingAddress.phone"
                  value={formData.billingAddress.phone}
                  onChange={handleChange}
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
              <input
                name="shippingAddress.attentionName"
                value={formData.shippingAddress.attentionName}
                onChange={handleChange}
                placeholder="Attention Name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Country</label>
              <input
                name="shippingAddress.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

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
              <input
                name="shippingAddress.pincode"
                value={formData.shippingAddress.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

              <label>Phone</label>
              <div>
                <input
                  name="shippingAddress.phone"
                  value={formData.shippingAddress.phone}
                  onChange={handleChange}
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
