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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading purchase orders</p>;

  return (
    <div className="thin-scroll h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border border-[#d9e1d9] bg-white p-3 shadow-sm">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#7b887b]">
        Purchase Orders
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3 w-full rounded-lg border border-[#d7dfd7] bg-[#f7faf7] px-3 py-2 text-sm font-medium text-[#2f7a47] focus:outline-none"
      >
        <option value="all">All Orders</option>
        <option value="active">Active Orders</option>
        <option value="inactive">Inactive Orders</option>
      </select>

      <div className="space-y-2">
        {filteredOrders.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No orders found</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => onSelectOrder(order.orderId)}
              className={`cursor-pointer rounded-xl border px-3 py-3 transition
                ${
                  String(selectedOrderId) === String(order.orderId)
                    ? "border-[#b9d8c0] bg-[#edf4ee]"
                    : "border-[#e3e9e3] bg-[#f8faf8] hover:bg-[#f1f6f1]"
                }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="truncate text-sm font-semibold text-[#1f2b1f]">
                {order.orderNumber || "No Order Number"}
                </p>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    order.isActive ? "bg-[#4a9f66]" : "bg-[#c47b7b]"
                  }`}
                />
              </div>
              <div className="flex justify-between text-xs text-[#6a776a]">
                <p className="truncate">{order.customerName || "No Customer"}</p>
                <p>Total: Rs. {order.totalAmount ?? 0}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListAllPurchase;

