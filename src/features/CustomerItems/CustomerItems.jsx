import useCustomerItems from "./useCustomerItems";
import { MdCurrencyRupee, MdEditDocument, MdAdd } from "react-icons/md";

const CustomerItems = ({ customerId }) => {
  const { items } = useCustomerItems(customerId);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer">
          Add Items
          <MdAdd size={14} />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No items found for this customer.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="bg-white border border-gray-200 rounded-lg p-4 relative"
            >
              <div className=" flex justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {item.itemName}
                </h3>
                <div className="flex gap-2 items-center">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {item.itemType}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                <span>
                  <span className="font-medium">Unit:</span> {item.unit}
                </span>
                <span>
                  <span className="font-medium">HSN:</span> {item.hsnCode}
                </span>
                <span>
                  <span className="font-medium">Tax:</span> {item.taxRate}%
                </span>
                <span>
                  <span className="font-medium">Source:</span> {item.source}
                </span>
              </div>

              {item.salesDescription && (
                <p className="mb-3 text-sm text-gray-600">
                  <span className="font-medium">Description:</span>{" "}
                  {item.salesDescription}
                </p>
              )}

              <div className="flex items-center pt-2">
                <span className="text-sm font-medium text-gray-600 mr-2">
                  Sales Price:
                </span>
                <span className="font-semibold text-blue-600 flex items-center text-base">
                  <MdCurrencyRupee size={16} />
                  {item.salesPrice}
                </span>
              </div>

              <button
                className="absolute bottom-3 right-3 text-yellow-500 hover:text-yellow-400 cursor-pointer"
                title="Edit"
              >
                <MdEditDocument size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerItems;
