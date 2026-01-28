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

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading items</p>;

  return (
    <div className="h-screen scrollbar-hide">
      {/* Dropdown Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full mb-2 text-sm focus:outline-none text-blue-600 font-medium"
      >
        <option value="all">All Items</option>
        <option value="active">Active Items</option>
        <option value="inactive">Inactive Items</option>
      </select>

      {/* Item List */}
      <div>
        {filteredItems.map((item) => (
          <div
            key={item.itemId}
            onClick={() => onSelectItem(item.itemId)}
            className={`p-4 cursor-pointer mb-1
        ${
          selectedItemId === String(item.itemId)
            ? "bg-blue-50 border-l-4 border-blue-600"
            : "bg-[#E2E8F0] hover:bg-blue-100"
        }
      `}
          >
            <div className="font-medium mb-1">{item.itemName}</div>
            <div className="text-xs text-gray-500 flex justify-between">
              <p>Buy {item.purchasePrice} </p>
              <p>Sell {item.salesPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllItems;
