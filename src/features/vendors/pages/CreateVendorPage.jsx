import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import useCreateVendor from "../hooks/useCreateVendor";

import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import ConnectionCandidatePicker from "../../../shared/components/ConnectionCandidatePicker";

import {
  emailRegex,
  phoneRegex,
  panRegex,
  gstRegex,
  pincodeRegex,
  nameRegex,
} from "../../../shared/utils/regex";

const CreateVendorPage = () => {
  const { companyId, vendorId: paramVendorId } = useParams();
  const { state } = useLocation();
  const vendorId = paramVendorId || state?.vendorId;
  const isEditMode = !!vendorId;
  const navigate = useNavigate();

  const {
    formData,
    errors,
    loading,
    submitResult,
    sameAsBilling,
    handleChange: originalHandleChange,
    handleSameAsBilling,
    submitVendor,
  } = useCreateVendor(vendorId);

  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [createOffline, setCreateOffline] = useState(false);

  const handleChange = (e) => {
    originalHandleChange(e);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    if (e.target.name === "phone" || e.target.name === "vendorName" || e.target.name === "displayName") {
      setSelectedCompany(null);
      setCreateOffline(false);
    }
  };

  const handleBlur = (name, errorMsg) => {
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const allErrors = { ...errors, ...fieldErrors };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitVendor({
      selectedConnectionCompanyId: selectedCompany?.companyId,
      skipConnectionRequest: createOffline,
    });
    if (!result) return;
    const createdVendorId = result?.responseData?.vendorId;
    if (!isEditMode && createdVendorId) {
      navigate(`/cf/company/${companyId}/vendors/${createdVendorId}/detail`, {
        state: {
          notice:
            selectedCompany
              ? "Vendor created with a pending connection request. Orders and payments unlock after both companies accept."
              : "Vendor created offline without a company connection.",
        },
      });
      return;
    }
    navigate(`/cf/company/${companyId}/vendors`);
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
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h1 className="mb-6 text-lg font-bold text-app-text">
        {isEditMode ? "Edit vendor" : "New vendor"}
      </h1>
      {submitResult?.responseMessage && (
        <div className="mb-5 rounded-lg border border-line bg-surface-soft px-4 py-3 text-xs font-semibold text-app-text">
          {submitResult.responseMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* ================= vendor ================= */}
        <div className="rounded-xl border border-line bg-app p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-app-sub">
            Vendor Details
          </p>
          <div className="grid max-w-3xl grid-cols-[180px_1fr] gap-4">
          <InputField
            label="Vendor Name"
            name="vendorName"
            required
            value={formData.vendorName}
            onChange={handleChange}
            onBlur={handleBlur}
            regex={nameRegex}
            regexError="Name cannot contain numbers."
            error={allErrors.vendorName}
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

        {!isEditMode && (
          <ConnectionCandidatePicker
            companyId={companyId}
            phone={formData.phone}
            name={formData.vendorName || formData.displayName}
            entityLabel="vendor"
            selectedCompany={selectedCompany}
            offline={createOffline}
            onSelectCompany={(company) => {
              setSelectedCompany(company);
              setCreateOffline(false);
            }}
            onCreateOffline={() => {
              setSelectedCompany(null);
              setCreateOffline(true);
            }}
          />
        )}

        {/* ================= ADDRESSES ================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* BILLING */}
          <div className="rounded-xl border border-line bg-app p-4">
            <h3 className="mb-4 text-base font-semibold text-brand">
              Billing Address
            </h3>
            <div className="grid grid-cols-[180px_1fr] gap-4">
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

              <SelectField
                label="Country"
                name="billingAddress.country"
                value={formData.billingAddress.country}
                onChange={handleChange}
                options={countryOptions}
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
          <div className="rounded-xl border border-line bg-app p-4">
            <div className="mb-4 flex justify-between">
              <h3 className="text-base font-semibold text-brand">
                Shipping Address
              </h3>
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => handleSameAsBilling(e.target.checked)}
                />
                Same as Billing
              </label>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-4">
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
            className="cursor-pointer rounded-lg bg-brand px-6 py-2 text-white transition hover:bg-brand-hover"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update vendor"
              : "Create vendor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVendorPage;
