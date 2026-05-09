import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useItemsPage from "../hooks/useItemsPage";
import ActionMenu from "../../../shared/components/ActionMenu";

const ItemsPage = () => {
  const {
    setItems, companyId,
    activateItem, deactivateItem,
    table, globalFilter, setGlobalFilter, allItems,
  } = useItemsPage();

  const navigate = useNavigate();
  const [itemsType, setItemsType] = useState("active");

  const handleItemsTypeChange = (e) => {
    const value = e.target.value;
    setItemsType(value);
    setItems(allItems.filter((i) => (value === "active" ? i.isActive : !i.isActive)));
  };

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <select
          value={itemsType}
          onChange={handleItemsTypeChange}
          className="cursor-pointer bg-transparent text-sm font-semibold text-app-text focus:outline-none"
        >
          <option value="active">Active Items</option>
          <option value="deleted">Deleted Items</option>
        </select>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted"
            />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search items..."
              className="form-input w-[220px] pl-8 text-xs py-1.5"
            />
          </div>
          <button
            onClick={() => navigate(`/cf/company/${companyId}/items/create`)}
            className="btn-primary text-xs"
          >
            <MdAdd size={15} /> New
          </button>
        </div>
      </div>

      <div className="bg-surface p-4">
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-line bg-surface-muted">
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-app-sub"
                  >
                    <div className="flex gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="py-16 text-center">
                  <p className="text-sm text-app-sub">No items found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-line-soft hover:bg-surface-hover"
                  onClick={() => navigate(`/cf/company/${companyId}/items/${row.original.itemId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm text-app-sub">{row.index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-brand-hover">
                    {row.getValue("itemName")}
                  </td>
                  <td className="px-5 py-3 text-sm text-app-text">
                    {row.getValue("itemType")}
                  </td>
                  <td className="px-5 py-3 text-sm text-app-text">
                    {row.getValue("unit")}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-app-text">
                    {row.getValue("baseSalesPrice")}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-app-text">
                    {row.getValue("basePurchasePrice")}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      row={row}
                      onEdit={() => navigate(`/cf/company/${companyId}/items/${row.original.itemId}/update`)}
                      onDelete={async () => {
                        if (window.confirm("Deactivate this item?")) {
                          try { await deactivateItem(companyId, row.original.itemId); }
                          catch { alert("Failed to deactivate item."); }
                        }
                      }}
                      onActivate={async () => {
                        if (window.confirm("Activate this item?")) {
                          try { await activateItem(companyId, row.original.itemId); }
                          catch { alert("Failed to activate item."); }
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
