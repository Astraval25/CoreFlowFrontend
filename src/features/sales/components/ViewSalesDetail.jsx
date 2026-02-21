import useViewSalesDetail from "../hooks/useViewSalesDetail";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Info from "../../../shared/components/Info";

const ViewSalesDetail = ({ companyId, orderId }) => {
  const { order, orderItems, loading, error } = useViewSalesDetail(
    companyId,
    orderId
  );
  const navigate = useNavigate();
  if (!orderId)
    return <p className="p-6 text-gray-600">Select an order to view details</p>;
  if (loading)
    return <p className="p-6 text-gray-600">Loading order details...</p>;
  if (error)
    return <p className="p-6 text-red-600">Error loading order details</p>;
  if (!order)
    return <p className="p-6 text-gray-600">No order data available</p>;

  const handleEdit = () => {
    navigate("/admin/create/sales", {
      state: { orderId: order.orderId },
    });
  };

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <div className="w-[35%] bg-[#E2E8F0] rounded-xl shadow-sm p-6 relative">
          <button
            className="absolute bottom-6 right-4 text-blue-500 hover:text-blue-600 flex gap-2"
            onClick={handleEdit}
          >
            <span className="font-semibold">Edit</span>
            <MdEdit size={18} />
          </button>

          <h2 className="text-xl font-bold mb-4">{order.orderNumber}</h2>

          <div className="flex flex-col gap-3">
            <Info
              label="Order Date"
              value={new Date(order.orderDate).toLocaleDateString()}
            />
            <Info label="Seller" value={order.sellerCompanyName} />
            <Info label="Customer" value={order.customerDisplayName} />
            <Info label="Vendor" value={order.vendorDisplayName} />
            <Info label="Order Status" value={order.orderStatus} />
            <Info label="Has Bill" value={order.hasBill ? "Yes" : "No"} />
          </div>
        </div>

        <div className="w-[35%] bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h1 className="font-semibold text-base mb-4">Order Summary</h1>
          <div className="flex flex-col gap-3">
            <Info label="Order Amount" value={`Rs.${order.orderAmount}`} />
            <Info label="Tax Amount" value={`Rs.${order.taxAmount}`} />
            <Info label="Discount" value={`Rs.${order.discountAmount}`} />
            <Info label="Delivery Charge" value={`Rs.${order.deliveryCharge}`} />
            <hr className="border-gray-300" />
            <Info label="Total Amount" value={`Rs.${order.totalAmount}`} />
            <Info label="Paid Amount" value={`Rs.${order.paidAmount}`} />
            <div className="flex items-start">
              <span className="w-35 text-sm text-gray-500">Status</span>
              <span
                className={`font-medium ${
                  order.isActive ? "text-green-500" : "text-red-500"
                }`}
              >
                : {order.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-[30%] bg-[#E2E8F0] rounded-xl shadow-sm p-6">
          <h1 className="font-semibold text-base mb-4">Order Items</h1>
          <div className="flex flex-col gap-3">
            {orderItems.map((item) => (
              <div
                key={item.orderItemId}
                className="last:pb-0 border-b last:border-b-0 border-gray-300"
              >
                <p className="font-medium text-sm mb-3">
                  {" "}
                  {item.itemId?.itemName}
                </p>
                <div className="flex flex-col gap-3">
                  <Info label="Item Name" value={item.itemName} />
                  <Info label="Quantity" value={item.quantity} />
                  <Info label="Price" value={`Rs.${item.updatedPrice}`} />
                  <Info label="Total" value={`Rs.${item.itemTotal}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSalesDetail;
