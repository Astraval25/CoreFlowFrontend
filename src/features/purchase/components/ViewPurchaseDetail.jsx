import useViewPurchaseDetail from "../hooks/useViewPurchaseDetail";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Info from "../../../shared/components/Info";

const ViewPurchaseDetail = ({ companyId, orderId }) => {
  const { order, loading, error } = useViewPurchaseDetail(companyId, orderId);
  const navigate = useNavigate();

  console.log("ViewPurchaseDetail - companyId:", companyId);
  console.log("ViewPurchaseDetail - orderId:", orderId);
  console.log("ViewPurchaseDetail - order:", order);
  console.log("ViewPurchaseDetail - loading:", loading);
  console.log("ViewPurchaseDetail - error:", error);

  const orderDetails = order?.orderDetails;
  const orderItems = order?.orderItems;

  if (!orderId)
    return <p className="p-6 text-gray-600">Select an order to view details</p>;

  if (!orderDetails)
    return <p className="p-6 text-gray-600">No order data found</p>;

  const handleEdit = () => {
    navigate("/admin/create/purchase", {
      state: { orderId: orderDetails.orderId },
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
            <Info label="Order Number" value={orderDetails.orderNumber} />
            <Info label="Order Date" value={new Date(orderDetails.orderDate).toLocaleDateString()} />
            <Info label="Order Status" value={orderDetails.orderStatus} />
            <Info label="Total Amount" value={` ${orderDetails.totalAmount}`} />
            <Info label="Paid Amount" value={` ${orderDetails.paidAmount || 0}`} />
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
          <div className="flex flex-col gap-3">
            <Info label="Order Amount" value={` ${orderDetails.orderAmount}`} />
            <Info label="Delivery Charge" value={` ${orderDetails.deliveryCharge || 0}`} />
            <Info label="Tax Amount" value={` ${orderDetails.taxAmount || 0}`} />
            <Info label="Discount Amount" value={` ${orderDetails.discountAmount || 0}`} />
            <Info label="Total Amount" value={` ${orderDetails.totalAmount}`} />
          </div>
        </div>

        {/* Vendor, Company, Item Details */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Details</h3>
          <div className="flex flex-col gap-3">
            <Info label="Company Name" value={orderDetails.buyerCompany?.companyName || "N/A"} />
            <Info label="Industry" value={orderDetails.buyerCompany?.industry || "N/A"} />
            <Info label="Vendor Name" value={orderDetails.vendors?.vendorName || "N/A"} />
            <Info label="Customer Name" value={orderDetails.customers?.customerName || "N/A"} />
            {orderItems && orderItems.length > 0 && (
              <Info label="Item Name" value={orderItems[0].itemId?.itemName || "N/A"} />
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
            <Info label="Order Amount" value={`${orderDetails.orderAmount}`} />
            <Info label="Discount" value={`${orderDetails.discountAmount || 0}`} />
            <Info label="Has Bill" value={orderDetails.hasBill ? "Yes" : "No"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseDetail;