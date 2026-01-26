import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useItemsPage from "../hooks/useItemsPage";
import ActionMenu from "../../../shared/components/ActionMenu";

const ItemsPage = () => {
  const {
    items,
    setItems,
    companyId,
    table,
    globalFilter,
    setGlobalFilter,
    allItems,
  } = useItemsPage();
  const navigate = useNavigate();

  const [ItemsType, setItemsType] = useState("active");

  const handleItemsTypeChange = (e) => {
    const value = e.target.value;
    setItemsType(value);

    if (value === "active") {
      setItems(allItems.filter((c) => c.isActive === true));
    } else {
      setItems(allItems.filter((c) => c.isActive === false));
    }
  };

  const handleEditItem = (item) => {
    navigate("/admin/create/item", {
      state: { itemId: item.itemId },
    });
  };

  const handleDeleteItem = (item) => {
    if (window.confirm("Are you sure you want to deactivate this item?")) {
      console.log("Deactivate item:", item.itemId);
    }
  };

  const handleActivateItem = (item) => {
    if (window.confirm("Are you sure you want to activate this item?")) {
      console.log("Activate item:", item.itemId);
    }
  };

  const handleNewItems = () => {
    navigate("/admin/create/item");
  };

  const handleViewItem = (item) => {
    navigate("/admin/view/item", {
      state: { itemId: item.itemId },
    });
  };

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        {/* Left Dropdown */}
        <select
          value={ItemsType}
          onChange={handleItemsTypeChange}
          className="cursor-pointer text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
        >
          <option value="active">Active Items</option>
          <option value="deleted">Deleted Items</option>
        </select>

        {/* Right: Search + New button */}
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300"></div>
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          <button
            onClick={handleNewItems}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            New
            <MdAdd size={18} />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-4 text-left font-semibold cursor-pointer select-none"
                  >
                    <div className="flex  gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc"}
                      {header.column.getIsSorted() === "desc"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-12 text-gray-500"
                >
                  No Items found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewItem(row.original);
                  }}
                >
                  <td className="px-6 py-4 text-gray-500 font-semibold text-left">
                    {row.index + 1}
                  </td>

                  <td className="px-6 py-4 text-blue-600 font-semibold text-left">
                    {row.getValue("itemName")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("itemType")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("unit")}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("salesPrice")}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("preferredCustomerName")}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("purchasePrice")}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("preferredVendorName")}
                  </td>

                  <td className="px-6 py-3 text-left">
                    <ActionMenu
                      row={row}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                      onActivate={handleActivateItem}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsPage;
