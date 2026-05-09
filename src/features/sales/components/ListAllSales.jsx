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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="thin-scroll h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border-r border-line bg-white p-3 shadow-sm">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-app-sub">
        Sales Orders
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3 w-full rounded-lg border border-brand-field-border bg-surface-hover px-3 py-2 text-sm font-medium text-brand focus:outline-none"
      >
        <option value="all">All Orders</option>
        <option value="active">Active Orders</option>
        <option value="inactive">Inactive Orders</option>
      </select>

      <div className="space-y-2">
        {filteredOrders.map((order) => (
          <div
            key={order.orderId}
            onClick={() => onSelectOrder(order.orderId)}
            className={`cursor-pointer rounded-xl border px-3 py-3 transition
              ${
                String(selectedOrderId) === String(order.orderId)
                  ? "border-brand-selected-border bg-brand-soft"
                  : "border-line bg-app hover:bg-surface-soft"
              }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate text-sm font-semibold text-app-text">
                {order.orderNumber}
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  order.isActive ? "bg-brand" : "bg-danger"
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-app-sub">
              <p className="truncate">{order.customerName || "No Customer"}</p>
              <p>Total: Rs. {order.totalAmount ?? 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllSales;

