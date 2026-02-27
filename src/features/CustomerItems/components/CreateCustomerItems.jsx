import useCreateCustomerItem from "../hooks/useCreateCustomerItem";
import SelectField from "../../../shared/components/SelectField";
import InputField from "../../../shared/components/InputField";
import TextArea from "../../../shared/components/TextArea";
import { useState } from "react";

const CreateCustomerItem = ({ customerId, onClose, onSuccess }) => {
  const { formData, allItems, handleChange, handleSubmit } =
    useCreateCustomerItem(customerId);
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.itemId) newErrors.itemId = "Please select an item";
    if (!formData.salesPrice) newErrors.salesPrice = "Please enter sales price";
    if (!formData.salesDescription)
      newErrors.salesDescription = "Please enter sales description";

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
        <h2 className="text-xl font-semibold mb-4">Add Customer Item</h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div>
              <SelectField
                label="Item"
                name="itemId"
                value={
                  allItems.find((i) => i.itemId == formData.itemId)?.itemName ||
                  ""
                }
                onChange={(e) => {
                  const selectedItem = allItems.find(
                    (i) => i.itemName === e.target.value
                  );
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
                        name: "salesPrice",
                        value: selectedItem.baseSalesPrice || "",
                      },
                    });
                    handleChange({
                      target: {
                        name: "salesDescription",
                        value: selectedItem.salesDescription || "",
                      },
                    });
                  }
                  setErrors((prev) => ({ ...prev, itemId: "" }));
                }}
                options={allItems.map((item) => ({
                  key: item.itemId,
                  value: item.itemName,
                }))}
                required
              />
              {errors.itemId && (
                <p className="text-red-500 text-xs mt-1">{errors.itemId}</p>
              )}
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
                  setErrors((prev) => ({ ...prev, salesPrice: "" }));
                }}
                required
              />
              {errors.salesPrice && (
                <p className="text-red-500 text-xs mt-1">{errors.salesPrice}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div>
              <TextArea
                label="Sales Description"
                name="salesDescription"
                value={formData.salesDescription}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, salesDescription: "" }));
                }}
                rows={3}
                error={errors.salesDescription}
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

export default CreateCustomerItem;
