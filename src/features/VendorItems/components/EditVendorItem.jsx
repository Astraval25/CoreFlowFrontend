import useEditVendorItem from "../hooks/useEditVendorItem";
import InputField from "../../../shared/components/InputField";
import { useState } from "react";

const EditVendorItem = ({ vendorId, item, onClose, onSuccess }) => {
  const { formData, handleChange, handleSubmit } = useEditVendorItem(vendorId, item);
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.purchasePrice) newErrors.purchasePrice = "Please enter purchase price";
    if (!formData.purchaseDescription) newErrors.purchaseDescription = "Please enter purchase description";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    const result = await handleSubmit();
    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Edit Vendor Item</h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={item.itemName}
                disabled
                className="w-90 px-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div>
              <InputField
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => {
                  handleChange(e);
                  setErrors(prev => ({ ...prev, purchasePrice: "" }));
                }}
                required
              />
              {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>}
            </div>
          </div>

          <div className="flex justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="purchaseDescription"
                value={formData.purchaseDescription}
                onChange={(e) => {
                  handleChange(e);
                  setErrors(prev => ({ ...prev, purchaseDescription: "" }));
                }}
                rows={3}
                className="w-90 px-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.purchaseDescription && <p className="text-red-500 text-xs mt-1">{errors.purchaseDescription}</p>}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVendorItem;
