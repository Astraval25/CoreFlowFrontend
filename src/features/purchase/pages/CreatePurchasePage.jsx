import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import useCreatePurchase from "../hooks/useCreatePurchase";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const CreatePurchasePage = () => {
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams();
  const { state } = useLocation();
  const orderId = paramOrderId || state?.orderId;

  const {
    formData,
    items,
    allVendors,
    loading,
    errors,
    isEditMode,
    handleInputChange,
    addOrderItem,
    updateOrderItem,
    removeOrderItem,
    submitPurchase,
  } = useCreatePurchase(orderId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await submitPurchase();

    if (result?.success) {
      alert(`Purchase ${isEditMode ? "updated" : "created"} successfully!`);
      navigate("/admin/purchase");
    }
  };

  return (
    <div className="rounded-2xl border border-[#d9e1d9] bg-white p-5 shadow-sm">
      <h1 className="mb-6 text-lg font-bold text-[#1f2b1f]">
        {isEditMode ? "Edit Purchase Order" : "New Purchase Order"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="rounded-xl border border-[#e2e8e2] bg-[#f8faf8] p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#738173]">
            Purchase Details
          </p>
          <div className="grid max-w-3xl grid-cols-[180px_1fr] gap-4">
          <SelectField
            label="Vendor"
            name="vendorId"
            value={
              allVendors.find((v) => v.vendorId == formData.vendorId)
                ?.displayName || ""
            }
            onChange={(e) => {
              const selectedVendor = allVendors.find(
                (v) => v.displayName === e.target.value
              );
              handleInputChange({
                target: {
                  name: "vendorId",
                  value: selectedVendor ? selectedVendor.vendorId : "",
                },
              });
            }}
            options={allVendors.map((v) => ({
              key: v.vendorId,
              value: v.displayName,
            }))}
            error={errors.vendorId}
            required
          />

          <InputField
            label="Tax Amount"
            name="taxAmount"
            type="number"
            value={formData.taxAmount}
            onChange={handleInputChange}
          />

          <InputField
            label="Delivery Charge"
            name="deliveryCharge"
            type="number"
            value={formData.deliveryCharge}
            onChange={handleInputChange}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasBill"
              checked={formData.hasBill}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Has Bill
            </label>
          </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8e2] bg-[#f8faf8] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#2f7a47]">Order Items</h3>
            <button
              type="button"
              onClick={addOrderItem}
              className="cursor-pointer rounded-lg bg-[#3f9f5f] px-4 py-2 text-white transition hover:bg-[#2f8d4f]"
            >
              Add Item
            </button>
          </div>
          {errors.orderItems && (
            <p className="text-red-500 text-sm mb-4">{errors.orderItems}</p>
          )}

          <div className="space-y-4">
            {formData.orderItems.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-[180px_1fr] gap-4">
                  <SelectField
                    label="Item"
                    value={item.itemName}
                    onChange={(e) =>
                      updateOrderItem(index, "itemName", e.target.value)
                    }
                    options={items.map((i) => ({
                      key: i.itemId,
                      value: i.itemName,
                    }))}
                  />

                  <InputField
                    label="Description"
                    value={item.itemDescription}
                    onChange={(e) =>
                      updateOrderItem(index, "itemDescription", e.target.value)
                    }
                  />

                  <InputField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateOrderItem(index, "quantity", e.target.value)
                    }
                  />

                  <InputField
                    label="Price"
                    type="number"
                    value={item.updatedPrice}
                    onChange={(e) =>
                      updateOrderItem(index, "updatedPrice", e.target.value)
                    }
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeOrderItem(index)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-lg bg-[#3f9f5f] px-6 py-2 text-white transition hover:bg-[#2f8d4f]"
          >
            {loading ? "Saving..." : isEditMode ? "Update Purchase" : "Create Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchasePage;
