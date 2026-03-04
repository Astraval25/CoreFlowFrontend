import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useState } from "react";
import useCreateCustomer from "../hooks/useCreateCustomer";

import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";

import {
  emailRegex,
  phoneRegex,
  panRegex,
  gstRegex,
  pincodeRegex,
  nameRegex,
} from "../../../shared/utils/regex";

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

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    originalHandleChange(e);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleBlur = (name, errorMsg) => {
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const allErrors = { ...errors, ...fieldErrors };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitCustomer();
    if (success) navigate("/admin/customers");
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
    <div className="rounded-2xl border border-[#d9e1d9] bg-white p-5 shadow-sm">
      <h1 className="mb-6 text-lg font-bold text-[#1f2b1f]">
        {isEditMode ? "Edit Customer" : "New Customer"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* ================= CUSTOMER ================= */}
        <div className="rounded-xl border border-[#e2e8e2] bg-[#f8faf8] p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#738173]">
            Customer Details
          </p>
          <div className="grid max-w-3xl grid-cols-[180px_1fr] gap-4">
          <InputField
            label="Customer Name"
            name="customerName"
            required
            value={formData.customerName}
            onChange={handleChange}
            onBlur={handleBlur}
            regex={nameRegex}
            regexError="Name cannot contain numbers."
            error={allErrors.customerName}
          />

          <InputField
            label="Display Name"
            name="displayName"
            required
            value={formData.displayName}
            onChange={handleChange}
            onBlur={handleBlur}
            regex={nameRegex}
            regexError="Name cannot contain numbers."
            error={allErrors.displayName}
          />

          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            regex={emailRegex}
            regexError="Invalid email address."
            error={allErrors.email}
          />

          <InputField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            regex={phoneRegex}
            regexError="Phone must be 10 digits."
            error={allErrors.phone}
          />

          <SelectField
            label="Language"
            name="lang"
            value={formData.lang}
            onChange={handleChange}
            options={languageOptions}
          />

          <InputField
            label="PAN"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            onBlur={handleBlur}
            regex={panRegex}
            regexError="Invalid PAN."
            error={allErrors.pan}
          />

          <InputField
            label="GST"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            onBlur={handleBlur}
            regex={gstRegex}
            regexError="Invalid GST."
            error={allErrors.gst}
          />
          </div>
        </div>

        {/* ================= ADDRESSES ================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* BILLING */}
          <div className="rounded-xl border border-[#e2e8e2] bg-[#f8faf8] p-4">
            <h3 className="mb-4 text-base font-semibold text-[#2f7a47]">Billing Address</h3>
            <div className="grid grid-cols-[180px_1fr] gap-y-4">
              <InputField
                label="Attention Name"
                name="billingAddress.attentionName"
                value={formData.billingAddress.attentionName}
                onChange={handleChange}
                onBlur={handleBlur}
                regex={nameRegex}
                regexError="Invalid name."
                error={allErrors["billingAddress.attentionName"]}
              />

              <SelectField
                label="Country"
                name="billingAddress.country"
                value={formData.billingAddress.country}
                onChange={handleChange}
                options={countryOptions}
              />

              <InputField
                label="Line 1"
                name="billingAddress.line1"
                value={formData.billingAddress.line1}
                onChange={handleChange}
              />

              <InputField
                label="Line 2"
                name="billingAddress.line2"
                value={formData.billingAddress.line2}
                onChange={handleChange}
              />

              <InputField
                label="City"
                name="billingAddress.city"
                value={formData.billingAddress.city}
                onChange={handleChange}
              />

              <InputField
                label="State"
                name="billingAddress.state"
                value={formData.billingAddress.state}
                onChange={handleChange}
              />

              <InputField
                label="Pincode"
                name="billingAddress.pincode"
                value={formData.billingAddress.pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                regex={pincodeRegex}
                regexError="Pincode must be 6 digits."
                error={allErrors["billingAddress.pincode"]}
              />

              <InputField
                label="Phone"
                name="billingAddress.phone"
                value={formData.billingAddress.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                regex={phoneRegex}
                regexError="Invalid phone."
                error={allErrors["billingAddress.phone"]}
              />

              <InputField
                label="Email"
                name="billingAddress.email"
                value={formData.billingAddress.email}
                onChange={handleChange}
                onBlur={handleBlur}
                regex={emailRegex}
                regexError="Invalid email."
                error={allErrors["billingAddress.email"]}
              />
            </div>
          </div>

          {/* SHIPPING */}
          <div className="rounded-xl border border-[#e2e8e2] bg-[#f8faf8] p-4">
            <div className="mb-4 flex justify-between">
              <h3 className="text-base font-semibold text-[#2f7a47]">Shipping Address</h3>
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => handleSameAsBilling(e.target.checked)}
                />
                Same as Billing
              </label>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-y-4">
              {["attentionName", "line1", "line2", "city", "state"].map((f) => (
                <InputField
                  key={f}
                  label={f.replace(/^\w/, (c) => c.toUpperCase())}
                  name={`shippingAddress.${f}`}
                  value={formData.shippingAddress[f]}
                  onChange={handleChange}
                />
              ))}

              <SelectField
                label="Country"
                name="shippingAddress.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                options={countryOptions}
              />

              <InputField
                label="Pincode"
                name="shippingAddress.pincode"
                value={formData.shippingAddress.pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                regex={pincodeRegex}
                regexError="Invalid pincode."
                error={allErrors["shippingAddress.pincode"]}
              />

              <InputField
                label="Phone"
                name="shippingAddress.phone"
                value={formData.shippingAddress.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                regex={phoneRegex}
                regexError="Invalid phone."
                error={allErrors["shippingAddress.phone"]}
              />

              <InputField
                label="Email"
                name="shippingAddress.email"
                value={formData.shippingAddress.email}
                onChange={handleChange}
                onBlur={handleBlur}
                regex={emailRegex}
                regexError="Invalid email."
                error={allErrors["shippingAddress.email"]}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-lg bg-[#3f9f5f] px-6 py-2 text-white transition hover:bg-[#2f8d4f]"
          >
            {loading
              ? "Saving..."
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
