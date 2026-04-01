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
    <div className="thin-scroll h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border-r border-[#d9e1d9] bg-white p-3 shadow-sm">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#7b887b]">
        Items
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3 w-full rounded-lg border border-[#d7dfd7] bg-[#f7faf7] px-3 py-2 text-sm font-medium text-[#2f7a47] focus:outline-none"
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
                  ? "border-[#b9d8c0] bg-[#edf4ee]"
                  : "border-[#e3e9e3] bg-[#f8faf8] hover:bg-[#f1f6f1]"
              }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate text-sm font-semibold text-[#1f2b1f]">
                {item.itemName}
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  item.isActive ? "bg-[#4a9f66]" : "bg-[#c47b7b]"
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-[#6a776a]">
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

