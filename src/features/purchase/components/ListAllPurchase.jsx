import { useState, useMemo } from "react";
import usePurchasePage from "../hooks/usePurchasePage";

const ListAllPurchase = ({ onSelectOrder, selectedOrderId }) => {
  const { order, loading, error } = usePurchasePage();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    if (!order) return [];
    if (statusFilter === "all") return order;
    const isActive = statusFilter === "active";
    return order.filter((ord) => ord.isActive === isActive);
  }, [statusFilter, order]);

  return (
    <div className="h-screen scrollbar-hide">
      {/* Dropdown Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full mb-2 text-sm focus:outline-none text-blue-600 font-medium"
      >
        <option value="all">All Orders</option>
        <option value="active">Active Orders</option>
        <option value="inactive">Inactive Orders</option>
      </select>

      {/* Order List */}
      <div>
        {filteredOrders.length === 0 ? (
          <p className="p-4 text-gray-500">No orders found</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => onSelectOrder(order.orderId)}
              className={`p-4 cursor-pointer mb-1
        ${
          selectedOrderId === String(order.orderId)
            ? "bg-blue-50 border-l-4 border-blue-600"
            : "bg-[#E2E8F0] hover:bg-blue-100"
        }
      `}
            >
              <div className="font-medium mb-1">
                {order.orderNumber || "No Order Number"}
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                <p>{order.customerName}</p>
                <p> Total: {order.totalAmount}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListAllPurchase;
