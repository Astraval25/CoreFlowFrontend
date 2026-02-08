import useEditCustomerItem from "../hooks/useEditCustomerItem";
import InputField from "../../../shared/components/InputField";
import { useState } from "react";

const EditCustomerItems = ({ customerId, item, onClose, onSuccess }) => {
  const { formData, handleChange, handleSubmit } = useEditCustomerItem(customerId, item);
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.salesPrice) newErrors.salesPrice = "Please enter sales price";
    if (!formData.salesDescription) newErrors.salesDescription = "Please enter sales description";

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
        <h2 className="text-xl font-semibold mb-4">Edit Customer Item</h2>

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
                label="Sales Price"
                name="salesPrice"
                type="number"
                value={formData.salesPrice}
                onChange={(e) => {
                  handleChange(e);
                  setErrors(prev => ({ ...prev, salesPrice: "" }));
                }}
                required
              />
              {errors.salesPrice && <p className="text-red-500 text-xs mt-1">{errors.salesPrice}</p>}
            </div>
          </div>

          <div className="flex justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="salesDescription"
                value={formData.salesDescription}
                onChange={(e) => {
                  handleChange(e);
                  setErrors(prev => ({ ...prev, salesDescription: "" }));
                }}
                rows={3}
                className="w-90 px-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.salesDescription && <p className="text-red-500 text-xs mt-1">{errors.salesDescription}</p>}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
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

export default EditCustomerItems;
