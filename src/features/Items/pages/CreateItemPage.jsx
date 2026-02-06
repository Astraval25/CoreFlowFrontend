import { useCreateItemPage } from "../hooks/useCreateItemPage";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import { itemNameRegex, priceRegex, hsnRegex } from "../../../shared/utils/regex";

const CreateItemPage = () => {
  const navigate = useNavigate();
  const { itemId: paramItemId } = useParams();
  const { state } = useLocation();

  const itemId = paramItemId || state?.itemId;

  const {
    formData,
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
    <div className="p-6">
      <h1 className="font-semibold text-lg mb-6">
        {isEditMode ? "Edit Item" : "New Item"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-[180px_1fr] gap-4 max-w-3xl">
          <InputField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={itemNameRegex}
            regexError="Item name can only contain letters, numbers, and underscores."
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
            name="baseSalesPrice"
            type="number"
            value={formData.baseSalesPrice}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={priceRegex}
            regexError="Please enter a valid price."
            error={allErrors.baseSalesPrice}
          />

          <InputField
            label="Purchase Price"
            name="basePurchasePrice"
            type="number"
            value={formData.basePurchasePrice}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={priceRegex}
            regexError="Please enter a valid price."
            error={allErrors.basePurchasePrice}
          />

          <InputField
            label="HSN Code"
            name="hsnCode"
            value={formData.hsnCode}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={hsnRegex}
            regexError="HSN code must be 4, 6, or 8 digits."
            error={allErrors.hsnCode}
          />

          <InputField
            label="Tax Rate (%)"
            name="taxRate"
            type="number"
            value={formData.taxRate}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h3 className="text-blue-600 font-medium mb-4 text-base">Descriptions</h3>
            <div className="grid grid-cols-[180px_1fr] gap-y-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
          </div>

          <div>
            <h3 className="text-green-600 font-medium mb-4 text-base">Item Image</h3>
            <div className="grid grid-cols-[180px_1fr] gap-y-4">
              {isEditMode && imageUrl && (
                <div className="col-span-2 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={imageUrl}
                    alt="Current item"
                    className="w-32 h-32 object-cover border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
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
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer"
          >
            {loading ? "Saving..." : isEditMode ? "Update Item" : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemPage;
