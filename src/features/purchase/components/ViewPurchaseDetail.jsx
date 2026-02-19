import useViewPurchaseDetail from "../hooks/useViewPurchaseDetail";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Info from "../../../shared/components/Info";

const ViewPurchaseDetail = ({ companyId, orderId }) => {
  const { order: orderData, loading, error } = useViewPurchaseDetail(companyId, orderId);
  const navigate = useNavigate();

  const order = orderData;
  const orderItems = orderData?.orderItems;

  if (!orderId)
    return <p className="p-6 text-gray-600">Select an order to view details</p>;

  if (!order)
    return <p className="p-6 text-gray-600">No order data found</p>;

  const handleEdit = () => {
    navigate("/admin/create/purchase", {
      state: { orderId: order.orderId },
    });
  };

  return (
    <div className="w-full">
      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Order Details */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm p-6 relative">
          <button
            className="absolute bottom-6 right-4 text-blue-500 hover:text-blue-600 flex gap-2"
            onClick={handleEdit}
          >
            <span className="font-semibold">Edit</span>
            <MdEdit size={18} />
          </button>

          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          <div className="flex flex-col gap-3">
            <Info label="Order Number" value={order.orderNumber} />
            <Info label="Order Date" value={new Date(order.orderDate).toLocaleDateString()} />
            <Info label="Order Status" value={order.orderStatus} />
            <Info label="Total Amount" value={` ${order.totalAmount}`} />
            <Info label="Paid Amount" value={` ${order.paidAmount || 0}`} />
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
          <div className="flex flex-col gap-3">
            <Info label="Order Amount" value={` ${order.orderAmount}`} />
            <Info label="Delivery Charge" value={` ${order.deliveryCharge || 0}`} />
            <Info label="Tax Amount" value={` ${order.taxAmount || 0}`} />
            <Info label="Discount Amount" value={` ${order.discountAmount || 0}`} />
            <Info label="Total Amount" value={` ${order.totalAmount}`} />
          </div>
        </div>

        {/* Vendor, Company, Item Details */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Details</h3>
          <div className="flex flex-col gap-3">
            <Info label="Company Name" value={order.buyerCompanyName || "N/A"} />
            <Info label="Vendor Name" value={order.vendorName || "N/A"} />
            {orderItems && orderItems.length > 0 && (
              <Info label="Item Name" value={orderItems[0].itemName || "N/A"} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex gap-4 mt-6">
        <div className="w-[70%]">
          <div className="flex gap-10 mb-2 text-gray-600 font-semibold">
            <button>Overview</button>
            <button>Items</button>
            <button>Payments</button>
            <button>History</button>
          </div>
          <hr className="text-gray-300" />
        </div>

        <div className="w-[30%] bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h1 className="font-semibold text-base mb-2">Additional Info</h1>
          <div className="flex flex-col gap-3">
            <Info label="Order Amount" value={`${order.orderAmount}`} />
            <Info label="Discount" value={`${order.discountAmount || 0}`} />
            <Info label="Has Bill" value={order.hasBill ? "Yes" : "No"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseDetail;