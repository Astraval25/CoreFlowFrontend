import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useItemsPage from "../hooks/useItemsPage";
import ActionMenu from "../../../shared/components/ActionMenu";

const ItemsPage = () => {
  const {
    items, setItems, companyId,
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
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <select
          value={itemsType}
          onChange={handleItemsTypeChange}
          className="text-sm font-semibold focus:outline-none bg-transparent cursor-pointer"
          style={{ color: "var(--text-main)" }}
        >
          <option value="active">Active Items</option>
          <option value="deleted">Deleted Items</option>
        </select>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search items…"
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 220 }}
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

      {/* ── Table ── */}
      <div className="card overflow-hidden">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-soft)", borderBottom: "1px solid var(--line)" }}>
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-5 py-3 text-left cursor-pointer select-none"
                    style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}
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
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>No items found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer"
                  style={{ borderBottom: "1px solid var(--line)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => navigate(`/cf/company/${companyId}/items/${row.original.itemId}/detail`)}
                >
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{row.index + 1}</td>
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    {row.getValue("itemName")}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--text-sub)" }}>
                    {row.getValue("itemType")}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--text-sub)" }}>
                    {row.getValue("unit")}
                  </td>
                  <td className="px-5 py-3 text-xs tabular-nums font-semibold" style={{ color: "var(--text-main)" }}>
                    {row.getValue("baseSalesPrice")}
                  </td>
                  <td className="px-5 py-3 text-xs tabular-nums font-semibold" style={{ color: "var(--text-main)" }}>
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
  );
};

export default ItemsPage;
