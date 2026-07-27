import { useState, useMemo } from "react";
import usePurchasePage from "../hooks/usePurchasePage";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const ListAllPurchase = ({ onSelectOrder, selectedOrderId }) => {
  const { order, loading, error } = usePurchasePage();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    if (!order) return [];
    if (statusFilter === "all") return order;
    const isActive = statusFilter === "active";
    return order.filter((ord) => ord.isActive === isActive);
  }, [statusFilter, order]);

  if (loading) {
    return (
      <div className="card p-4">
        <p className="text-sm text-app-sub">Loading purchase orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4">
        <p className="text-sm text-danger">Error loading purchase orders</p>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-app-sub">
          Purchase Orders
        </p>
        <span className="badge badge-blue">{filteredOrders.length}</span>
      </div>

      <div className="mb-4 flex rounded-lg border border-line bg-surface-soft p-1">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setStatusFilter(filter.key)}
            className="flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: statusFilter === filter.key ? "var(--surface-bg)" : "transparent",
              color: statusFilter === filter.key ? "var(--accent)" : "var(--text-sub)",
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="thin-scroll max-h-[calc(100vh-260px)] space-y-2 overflow-y-auto pr-1">
        {filteredOrders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-3 py-8 text-center text-sm text-app-sub">
            No orders found
          </p>
        ) : (
          filteredOrders.map((order) => (
            <button
              key={order.orderId}
              type="button"
              onClick={() => onSelectOrder(order.orderId)}
              className={`w-full cursor-pointer rounded-xl border px-3 py-3 text-left transition ${
                String(selectedOrderId) === String(order.orderId)
                  ? "border-brand-selected-border bg-brand-soft"
                  : "border-line bg-app hover:bg-surface-soft"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-app-text">
                  {order.orderNumber || "No Order Number"}
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
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ListAllPurchase;

