import { MdAdd, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useWorkDefinitions } from "../hooks/useWorkDefinitions";
import ActionMenu from "../../../shared/components/ActionMenu";

const WorkDefinitionsPage = () => {
  const { table, globalFilter, setGlobalFilter, deactivateWorkDef, companyId } = useWorkDefinitions();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Work Definitions</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search…" className="form-input pl-8 text-xs py-1.5" style={{ width: 220 }} />
          </div>
          <button onClick={() => navigate(`/cf/company/${companyId}/work-definitions/create`)} className="btn-primary text-xs">
            <MdAdd size={15} /> New
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-soft)", borderBottom: "1px solid var(--line)" }}>
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-5 py-3 text-left cursor-pointer select-none" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                    <div className="flex gap-1">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={table.getAllColumns().length} className="py-16 text-center"><p className="text-xs" style={{ color: "var(--text-muted)" }}>No work definitions found</p></td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid var(--line)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{row.index + 1}</td>
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: "var(--accent)" }}>{row.original.workCode}</td>
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: "var(--text-main)" }}>{row.original.workName}</td>
                  <td className="px-5 py-3 text-xs tabular-nums font-semibold" style={{ color: "var(--text-main)" }}>₹{row.original.ratePerUnit}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{row.original.unit}</td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      row={row}
                      onEdit={() => navigate(`/cf/company/${companyId}/work-definitions/${row.original.workDefId}/update`)}
                      onDelete={async () => { if (window.confirm("Deactivate this work definition?")) await deactivateWorkDef(row.original.workDefId); }}
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

export default WorkDefinitionsPage;
