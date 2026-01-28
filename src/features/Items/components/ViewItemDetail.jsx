import useViewItemDetail from "../hooks/useViewItemDetail";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Info from "../../../shared/components/Info";

const ViewItemDetail = ({ companyId, itemId }) => {
  const { item, loading, imageUrl, error } = useViewItemDetail(
    companyId,
    itemId
  );
  const navigate = useNavigate();

  if (!itemId)
    return <p className="p-6 text-gray-600">Select an item to view details</p>;
  if (loading)
    return <p className="p-6 text-gray-600">Loading item details...</p>;
  if (error)
    return <p className="p-6 text-red-600">Error loading item details</p>;

  const handleEdit = () => {
    navigate("/admin/create/item", {
      state: { itemId: item.itemId },
    });
  };

  return (
    <div className="w-full">
      {/* 70 / 30 layout */}
      <div className="flex gap-4">
        <div className="w-[70%] bg-[#E2E8F0] rounded-xl shadow-sm p-3 relative">
          <button
            className="absolute bottom-6 right-4 text-blue-500 hover:text-blue-600 flex gap-2"
            onClick={handleEdit}
          >
            <span className="font-semibold">Edit</span>
            <MdEdit size={18} />
          </button>

          {/* Header */}
          <h2 className="text-xl font-bold mb-3">{item.itemName}</h2>

          <div className="flex gap-6">
            {/* Image */}
            <div className="w-50 h-50 shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.itemName}
                  className="w-full h-full object-cover rounded-xl shadow"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {item.itemName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Details using Info */}
            <div className="flex flex-col gap-3 w-full">
              <p className="font-semibold text-base">{item.itemName}</p>
              <div className="flex gap-2">
                <p className="font-semibold text-sm text-gray-600">
                  {item.itemType}
                </p>{" "}
                |{" "}
                <p className="font-semibold text-sm text-gray-600">
                  {item.unit}
                </p>
              </div>
              <Info label="Sales Price" value={`₹${item.salesPrice}`} />
              <Info label="Purchase Price" value={`₹${item.purchasePrice}`} />
              <Info
                label="Preferred Customer"
                value={item.preferredCustomerDisplayName}
              />
              <Info
                label="Preferred Vendor"
                value={item.preferredVendorDisplayName}
              />
            </div>
          </div>
        </div>

        <div className="w-[30%] bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h1 className="font-semibold text-base mb-2">Item Details</h1>
          <div className="flex flex-col gap-3">
            <Info label="Unit" value={item.unit} />
            <Info label="HSN Code" value={item.hsnCode} />
            <Info label="Tax Rate" value={`${item.taxRate}%`} />
            <div className="flex items-start">
              <span className="w-35 text-sm text-gray-500">Status</span>
              <span
                className={`font-medium ${
                  item.isActive ? "text-green-500" : "text-red-500"
                }`}
              >
                : {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <Info
              label="Last Update"
              value={new Date(item.lastModifiedDt).toLocaleDateString()}
            />
            <Info
              label="Update Time"
              value={new Date(item.lastModifiedDt).toLocaleTimeString()}
            />
          </div>

          {/* Descriptions */}
          {/* <div className="mt-6 border-t pt-4 flex flex-col gap-3">
            <Info label="Sales Desc" value={item.salesDescription} />
            <Info label="Purchase Desc" value={item.purchaseDescription} />
          </div> */}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <div className="w-[70%]">
          <div className="flex gap-10 mb-2 text-gray-600 font-semibold">
            <button>Overview</button>
            <button>Statistics</button>
            <button>Stock Track</button>
            <button>Transaction</button>
          </div>
          <hr className="text-gray-300" />
        </div>

        <div className="w-[30%] bg-[#E2E8F0] rounded-xl shadow-sm p-3">
          <h1 className="font-semibold text-base mb-2">Pricing</h1>
          <div className="flex flex-col gap-3">
            <div className="border border-gray-300 px-3 py-1 bg-gray-100">
              <span className="text-sm text-gray-500 font-medium">
                Sales Description:
              </span>
              <p className="text-gray-900 font-medium mt-1">
                {item.salesDescription || "N/A"}
              </p>
            </div>
            <hr className="border border-gray-300" />
            <Info label="Sales Price" value={`₹${item.salesPrice}`} />
            <Info label="Purchase Price" value={`₹${item.purchasePrice}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemDetail;
