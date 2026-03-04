import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import useCreateSales from "../hooks/useCreateSales";
import { useNavigate } from "react-router-dom";

const CreateSalesPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    items,
    allCustomers,
    loading,
    errors,
    handleInputChange,
    addOrderItem,
    updateOrderItem,
    removeOrderItem,
    submitSales,
  } = useCreateSales();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await submitSales();

    if (result?.success) {
      alert("Sales order created successfully!");
      navigate("/admin/sales");
    }
  };

  return (
    <div className="rounded-2xl border border-[#d9e1d9] bg-white p-5 shadow-sm">
      <h1 className="mb-6 text-lg font-bold text-[#1f2b1f]">New Sales Order</h1>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="rounded-xl border border-[#e2e8e2] bg-[#f8faf8] p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#738173]">
            Sales Details
          </p>
          <div className="grid max-w-3xl grid-cols-[180px_1fr] gap-4">
          <SelectField
            label="Customer"
            name="customerId"
            value={
              allCustomers.find((c) => c.customerId == formData.customerId)
                ?.displayName || ""
            }
            onChange={(e) => {
              const selectedCustomer = allCustomers.find(
                (c) => c.displayName === e.target.value
              );
              handleInputChange({
                target: {
                  name: "customerId",
                  value: selectedCustomer ? selectedCustomer.customerId : "",
                },
              });
            }}
            options={allCustomers.map((c) => ({
              key: c.customerId,
              value: c.displayName,
            }))}
            error={errors.customerId}
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
            label="Discount Amount"
            name="discountAmount"
            type="number"
            value={formData.discountAmount}
            onChange={handleInputChange}
          />

          <InputField
            label="Delivery Charge"
            name="deliveryCharge"
            type="number"
            value={formData.deliveryCharge}
            onChange={handleInputChange}
            error={errors.deliveryCharge}
            required
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
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
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
                    error={errors[`item_${index}_itemId`]}
                    required
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
                    error={errors[`item_${index}_quantity`]}
                    required
                  />

                  <InputField
                    label="Price"
                    type="number"
                    value={item.updatedPrice}
                    onChange={(e) =>
                      updateOrderItem(index, "updatedPrice", e.target.value)
                    }
                    error={errors[`item_${index}_price`]}
                    required
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
            {loading ? "Saving..." : "Create Sales Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSalesPage;
