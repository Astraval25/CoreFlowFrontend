import useCreateVendorItem from "../hooks/useCreateVendorItem";
import SelectField from "../../../shared/components/SelectField";
import InputField from "../../../shared/components/InputField";
import TextArea from "../../../shared/components/TextArea";
import { useState } from "react";

const CreateVendorItem = ({ vendorId, onClose, onSuccess }) => {
  const { formData, allItems, handleChange, handleSubmit } = useCreateVendorItem(vendorId);
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.itemId) newErrors.itemId = "Please select an item";
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
        <h2 className="text-xl font-semibold mb-4">Add Vendor Item</h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div>
              <SelectField
                label="Item"
                name="itemId"
                value={allItems.find(i => i.itemId == formData.itemId)?.itemName || ""}
                onChange={(e) => {
                  const selectedItem = allItems.find(i => i.itemName === e.target.value);
                  if (selectedItem) {
                    handleChange({
                      target: {
                        name: "itemId",
                        value: selectedItem.itemId,
                      },
                    });
                    // Prefill price and description
                    handleChange({
                      target: {
                        name: "purchasePrice",
                        value: selectedItem.basePurchasePrice || "",
                      },
                    });
                    handleChange({
                      target: {
                        name: "purchaseDescription",
                        value: selectedItem.purchaseDescription || "",
                      },
                    });
                  }
                  setErrors(prev => ({ ...prev, itemId: "" }));
                }}
                options={allItems.map(item => ({
                  key: item.itemId,
                  value: item.itemName,
                }))}
                required
              />
              {errors.itemId && <p className="text-red-500 text-xs mt-1">{errors.itemId}</p>}
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
              <TextArea
                label="Purchase Description"
                name="purchaseDescription"
                value={formData.purchaseDescription}
                onChange={(e) => {
                  handleChange(e);
                  setErrors(prev => ({ ...prev, purchaseDescription: "" }));
                }}
                rows={3}
                error={errors.purchaseDescription}
                required
              />
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVendorItem;
