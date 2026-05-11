import { MdAdd, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useWorkDefinitions } from "../hooks/useWorkDefinitions";
import ActionMenu from "../../../shared/components/ActionMenu";

const WorkDefinitionsPage = () => {
  const { table, globalFilter, setGlobalFilter, deactivateWorkDef, companyId } =
    useWorkDefinitions();

  const navigate = useNavigate();

  const handleRowClick = (workDefId) => {
    navigate(`/cf/company/${companyId}/work-definitions/${workDefId}`);
  };

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-semibold text-app-text">
          Work Definitions
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
            />

            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 220 }}
            />
          </div>

          <button
            onClick={() =>
              navigate(`/cf/company/${companyId}/work-definitions/create`)
            }
            className="btn-primary text-xs"
          >
            <MdAdd size={15} /> New
          </button>
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-5 py-3 text-left cursor-pointer select-none text-[11px] font-bold uppercase tracking-[0.05em] text-app-sub"
                    >
                      <div className="flex gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="py-16 text-center"
                  >
                    <p className="text-sm text-app-sub">
                      No work definitions found
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.original.workDefId)}
                    className="border-b border-line-soft hover:bg-surface-hover cursor-pointer"
                  >
                    <td className="px-5 py-3 text-sm text-app-sub">
                      {row.index + 1}
                    </td>

                    <td className="px-5 py-3 text-sm font-medium text-brand-hover">
                      {row.original.workCode}
                    </td>

                    <td className="px-5 py-3 text-sm font-medium text-app-text">
                      {row.original.workName}
                    </td>

                    <td className="px-5 py-3 text-sm tabular-nums font-medium text-app-text">
                      Rs {row.original.ratePerUnit}
                    </td>

                    <td className="px-5 py-3 text-sm text-app-text">
                      {row.original.unit}
                    </td>

                    <td
                      className="px-5 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionMenu
                        row={row}
                        onEdit={() =>
                          navigate(
                            `/cf/company/${companyId}/work-definitions/${row.original.workDefId}/update`
                          )
                        }
                        onDelete={async () => {
                          if (
                            window.confirm("Deactivate this work definition?")
                          ) {
                            await deactivateWorkDef(row.original.workDefId);
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

export default WorkDefinitionsPage;
