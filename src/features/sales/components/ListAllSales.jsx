import { useState, useMemo } from "react";
import useListAllSales from "../hooks/useListAllSales";

const ListAllSales = ({ onSelectOrder, selectedOrderId }) => {
  const { orders, loading } = useListAllSales();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (statusFilter === "all") return orders;
    const isActive = statusFilter === "active";
    return orders.filter((order) => order.isActive === isActive);
  }, [statusFilter, orders]);

  return (
    <div className="h-screen scrollbar-hide">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full mb-2 text-sm focus:outline-none text-blue-600 font-medium"
      >
        <option value="all">All Orders</option>
        <option value="active">Active Orders</option>
        <option value="inactive">Inactive Orders</option>
      </select>

      <div>
        {filteredOrders.map((order) => (
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
            <div className="font-medium mb-1">{order.orderNumber}</div>
            <div className="text-xs text-gray-500 flex justify-between">
              <p>{order.customerName}</p>
              <p>Total: Rs. {order.totalAmount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllSales;
