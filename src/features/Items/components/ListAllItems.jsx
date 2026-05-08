import { useState, useMemo } from "react";
import useListAllItems from "../hooks/useListAllItems";

const ListAllItems = ({ onSelectItem, selectedItemId }) => {
  const { items, loading, error } = useListAllItems();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (statusFilter === "all") return items;
    const isActive = statusFilter === "active";
    return items.filter((item) => item.isActive === isActive);
  }, [statusFilter, items]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading items</p>;

  return (
    <div className="thin-scroll h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border-r border-line bg-white p-3 shadow-sm">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-app-sub">
        Items
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3 w-full rounded-lg border border-brand-field-border bg-surface-hover px-3 py-2 text-sm font-medium text-brand focus:outline-none"
      >
        <option value="all">All Items</option>
        <option value="active">Active Items</option>
        <option value="inactive">Inactive Items</option>
      </select>

      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.itemId}
            onClick={() => onSelectItem(item.itemId)}
            className={`cursor-pointer rounded-xl border px-3 py-3 transition
              ${
                String(selectedItemId) === String(item.itemId)
                  ? "border-brand-selected-border bg-brand-soft"
                  : "border-line bg-app hover:bg-surface-soft"
              }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate text-sm font-semibold text-app-text">
                {item.itemName}
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  item.isActive ? "bg-brand" : "bg-danger"
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-app-sub">
              <p>Buy: Rs. {item.basePurchasePrice ?? 0}</p>
              <p>Sell: Rs. {item.baseSalesPrice ?? 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllItems;

