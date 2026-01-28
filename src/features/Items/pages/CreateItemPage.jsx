import { useCreateItemPage } from "../hooks/useCreateItemPage";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import { itemNameRegex, priceRegex } from "../../../shared/utils/regex";

const CreateItemPage = () => {
  const navigate = useNavigate();
  const { itemId: paramItemId } = useParams();
  const { state } = useLocation();

  const itemId = paramItemId || state?.itemId;

  const {
    formData,
    customers,
    vendors,
    file,
    errors,
    loading,
    isEditMode,
    imageUrl,
    handleInputChange: originalHandleInputChange,
    handleFileChange,
    saveItem,
  } = useCreateItemPage(itemId);

  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    originalHandleInputChange(e);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleBlur = (name, errorMsg) => {
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const allErrors = { ...errors, ...fieldErrors };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await saveItem();

    if (result?.success) {
      alert(`Item ${isEditMode ? "updated" : "created"} successfully!`);
      navigate("/admin/items");
    } else {
      alert(result?.message || "Something went wrong");
    }
  };

  const itemTypeOptions = [
    { key: "goods", value: "GOODS" },
    { key: "service", value: "SERVICE" },
  ];

  const unitOptions = [
    { key: "pcs", value: "PCS" },
    { key: "kg", value: "KG" },
    { key: "ml", value: "ML" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? "Edit Item" : "Create New Item"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={itemNameRegex}
            regexError="Item name can only contain letters, numbers, and underscores."
            placeholder="Enter item name"
            error={allErrors.itemName}
            required
          />

          <SelectField
            label="Item Type"
            name="itemType"
            value={formData.itemType}
            onChange={handleInputChange}
            options={itemTypeOptions}
            error={allErrors.itemType}
            required
          />

          <SelectField
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            options={unitOptions}
          />

          <InputField
            label="Sales Price"
            name="salesPrice"
            type="number"
            value={formData.salesPrice}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={priceRegex}
            regexError="Please enter a valid price."
            placeholder="0.00"
            error={allErrors.salesPrice}
          />

          <InputField
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={formData.purchasePrice}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={priceRegex}
            regexError="Please enter a valid price."
            placeholder="0.00"
            error={allErrors.purchasePrice}
          />

          <InputField
            label="HSN Code"
            name="hsnCode"
            value={formData.hsnCode}
            onChange={handleInputChange}
            placeholder="Enter HSN code"
          />

          <InputField
            label="Tax Rate (%)"
            name="taxRate"
            type="number"
            value={formData.taxRate}
            onChange={handleInputChange}
            placeholder="0.00"
          />

          <SelectField
            label="Preferred Customer"
            name="preferredCustomerId"
            value={
              customers.find(
                (c) => c.customerId == formData.preferredCustomerId
              )?.displayName || ""
            }
            onChange={(e) => {
              const selectedCustomer = customers.find(
                (c) => c.displayName === e.target.value
              );
              originalHandleInputChange({
                target: {
                  name: "preferredCustomerId",
                  value: selectedCustomer ? selectedCustomer.customerId : "",
                },
              });
            }}
            options={customers.map((customer, index) => ({
              key: `customer-${customer.customerId}-${index}`,
              value: customer.displayName,
            }))}
          />

          <SelectField
            label="Preferred Vendor"
            name="preferredVendorId"
            value={
              vendors.find((v) => v.vendorId == formData.preferredVendorId)
                ?.displayName || ""
            }
            onChange={(e) => {
              const selectedVendor = vendors.find(
                (v) => v.displayName === e.target.value
              );
              originalHandleInputChange({
                target: {
                  name: "preferredVendorId",
                  value: selectedVendor ? selectedVendor.vendorId : "",
                },
              });
            }}
            options={vendors.map((vendor, index) => ({
              key: `vendor-${vendor.vendorId}-${index}`,
              value: vendor.displayName,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Sales Description
            </label>
            <textarea
              name="salesDescription"
              value={formData.salesDescription}
              onChange={handleInputChange}
              placeholder="Enter sales description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Description
            </label>
            <textarea
              name="purchaseDescription"
              value={formData.purchaseDescription}
              onChange={handleInputChange}
              placeholder="Enter purchase description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Item Image
          </label>

          {/* Display existing image if in edit mode */}
          {isEditMode && imageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <img
                src={imageUrl}
                alt="Current item"
                className="w-50 h-50 object-cover border border border-gray-300 rounded-lg"
              />
            </div>
          )}

          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && (
            <p className="text-sm text-gray-600 mt-1">
              New file selected: {file.name}
            </p>
          )}
          {isEditMode && !file && (
            <p className="text-sm text-gray-500 mt-1">
              Select a new file to replace the current image
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "Update Item" : "Create Item"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/items")}
            className="border px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemPage;
