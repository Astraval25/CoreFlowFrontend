import { useMemo, useState } from "react";
import {
  MdArrowBack,
  MdCalendarToday,
  MdFilterList,
  MdKeyboardArrowDown,
  MdRefresh,
} from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatValue = (value) => {
  if (value === null || value === undefined) return "-";
  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? value.toLocaleString("en-IN")
      : value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const toRows = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return [value];
  return [];
};

const escapeTsv = (value) => {
  const text = formatValue(value);
  return String(text).replace(/\t/g, " ").replace(/\r?\n/g, " ");
};

const isNumericValue = (value) => typeof value === "number" && Number.isFinite(value);

const buildGraphPayload = (rows, columns) => {
  if (!rows.length || !columns.length) {
    return { chartType: "none", data: [], xKey: "", yKeys: [] };
  }

  const defaultXCandidates = ["month", "name", "partyName", "itemName", "mode", "account"];
  const xKey =
    defaultXCandidates.find((candidate) => columns.includes(candidate)) || columns[0];

  const numericKeys = columns.filter((column) =>
    rows.some((row) => isNumericValue(row[column]))
  );

  const yKeys = numericKeys.filter((key) => key !== xKey);

  if (rows.length === 1 && yKeys.length > 1) {
    const data = yKeys.map((key) => ({ metric: key, value: rows[0][key] ?? 0 }));
    return { chartType: "single-row", data, xKey: "metric", yKeys: ["value"] };
  }

  if (!yKeys.length) {
    return { chartType: "none", data: [], xKey, yKeys: [] };
  }

  const chartType = yKeys.length > 1 ? "multi-line" : "bar";
  return { chartType, data: rows, xKey, yKeys };
};

const ReportDetailTable = ({ value, onColumnsReady }) => {
  const rows = toRows(value);

  const columns = useMemo(
    () =>
      Array.from(
        rows.reduce((set, row) => {
          Object.keys(row).forEach((key) => set.add(key));
          return set;
        }, new Set())
      ),
    [rows]
  );

  useMemo(() => {
    onColumnsReady(columns, rows);
  }, [columns, rows, onColumnsReady]);

  if (!rows.length) {
    return <p className="text-sm py-8 text-center" style={{ color: "var(--text-muted)" }}>No records found for selected report.</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[560px]">
        <thead>
          <tr style={{ background: "var(--surface-muted)", borderBottom: "1px solid var(--line)" }}>
            {columns.map((column) => (
              <th
                key={column}
                className="px-5 py-3 text-left text-[11px] uppercase tracking-wide"
                style={{ color: "var(--text-sub)" }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${JSON.stringify(row)}`} style={{ borderBottom: "1px solid var(--line-soft)" }}>
              {columns.map((column) => (
                <td key={column} className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>
                  {formatValue(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ReportDetailView = ({
  selectedReport,
  selectedReportData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  loadReports,
  loading,
  error,
  companyName,
  formatDatePretty,
  onBack,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [exportColumns, setExportColumns] = useState([]);
  const [exportRows, setExportRows] = useState([]);

  const fileBaseName = (selectedReport?.name || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const exportExcel = () => {
    if (!exportColumns.length) return;

    const lines = [
      exportColumns.join("\t"),
      ...exportRows.map((row) => exportColumns.map((column) => escapeTsv(row[column])).join("\t")),
    ];
    const tsv = lines.join("\n");

    const blob = new Blob(["\uFEFF", tsv], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBaseName || "report"}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportPdf = () => {
    if (!exportColumns.length) return;

    const tableHead = `<tr>${exportColumns.map((c) => `<th>${c}</th>`).join("")}</tr>`;
    const tableBody = exportRows
      .map((row) => `<tr>${exportColumns.map((c) => `<td>${escapeTsv(row[c])}</td>`).join("")}</tr>`)
      .join("");

    const html = `
      <html>
        <head>
          <title>${selectedReport?.name || "Report"}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { margin: 0 0 8px 0; font-size: 20px; }
            p { margin: 0 0 16px 0; color: var(--text-sub); }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid var(--line); padding: 8px; text-align: left; }
            th { background: var(--surface-muted); }
          </style>
        </head>
        <body>
          <h1>${selectedReport?.name || "Report"}</h1>
          <p>${companyName} | ${formatDatePretty(startDate)} - ${formatDatePretty(endDate)}</p>
          <table>
            <thead>${tableHead}</thead>
            <tbody>${tableBody}</tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setExportOpen(false);
  };

  const graphPayload = useMemo(
    () => buildGraphPayload(exportRows, exportColumns),
    [exportRows, exportColumns]
  );

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "var(--surface-bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid var(--accent-field-border)", background: "var(--surface-hover)" }}
            onClick={onBack}
          >
            <MdArrowBack size={18} style={{ color: "var(--text-heading)" }} />
          </button>
          <div>
            <p className="text-xs" style={{ color: "var(--text-sub)" }}>{selectedReport?.category || "Report"}</p>
            <h2 className="text-3xl font-semibold" style={{ color: "var(--text-main)" }}>{selectedReport?.name || "Report"}</h2>
            <p className="text-xs mt-1" style={{ color: "var(--text-sub)" }}>
              From {formatDatePretty(startDate)} to {formatDatePretty(endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--accent-field-border)" }}>
            <button
              className="px-3 py-2 text-sm"
              style={{
                background: viewMode === "table" ? "var(--surface-soft)" : "var(--surface-bg)",
                color: "var(--text-heading)",
              }}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
            <button
              className="px-3 py-2 text-sm"
              style={{
                background: viewMode === "graph" ? "var(--surface-soft)" : "var(--surface-bg)",
                color: "var(--text-heading)",
                borderLeft: "1px solid var(--accent-field-border)",
              }}
              onClick={() => setViewMode("graph")}
            >
              Graph
            </button>
          </div>

          <div className="relative">
            <button
              className="px-3 py-2 rounded-lg text-sm inline-flex items-center gap-1"
              style={{ border: "1px solid var(--accent-field-border)", color: "var(--text-heading)", background: "var(--surface-bg)" }}
              onClick={() => setExportOpen((prev) => !prev)}
            >
              Export
              <MdKeyboardArrowDown size={16} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-lg shadow-lg z-20" style={{ background: "var(--surface-bg)", border: "1px solid var(--accent-field-border)" }}>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                  onClick={exportExcel}
                >
                  Excel
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                  onClick={exportPdf}
                >
                  PDF
                </button>
              </div>
            )}
          </div>

          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid var(--accent-field-border)", color: "var(--text-heading)", background: "var(--surface-bg)" }}
            onClick={loadReports}
            disabled={loading}
          >
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 py-3 flex flex-wrap items-center gap-2" style={{ background: "var(--surface-hover)", borderBottom: "1px solid var(--line)" }}>
        <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
          <MdFilterList size={18} /> Filters:
        </span>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ border: "1px solid var(--accent-field-border)", background: "var(--surface-bg)", color: "var(--text-heading)" }}>
          <MdCalendarToday size={14} />
          <span>Date Range</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs outline-none" />
          <span>-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs outline-none" />
        </div>

        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "var(--accent)", color: "var(--surface-bg)" }}
          onClick={loadReports}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Report"}
        </button>
      </div>

      <div className="p-4 h-[calc(100vh-235px)] overflow-auto" style={{ background: "var(--app-bg)" }}>
        {error && (
          <div className="mb-3 px-3 py-2 rounded text-sm" style={{ background: "var(--red-alert-bg)", border: "1px solid var(--red-alert-border)", color: "var(--red-alert-text)" }}>
            {error}
          </div>
        )}

        <div className="rounded-xl p-4" style={{ border: "1px solid var(--line)", background: "var(--surface-bg)" }}>
          <div className="mb-5">
            <p className="text-sm" style={{ color: "var(--text-sub)" }}>{companyName}</p>
          </div>

          <div className="text-center mb-4">
            <h3 className="text-4xl font-semibold" style={{ color: "var(--text-main)" }}>{selectedReport?.name || "Report"}</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-sub)" }}>
              From {formatDatePretty(startDate)} To {formatDatePretty(endDate)}
            </p>
          </div>

          {(viewMode === "table" || !exportColumns.length) && (
            <ReportDetailTable
              value={selectedReportData}
              onColumnsReady={(cols, rows) => {
                setExportColumns(cols);
                setExportRows(rows);
              }}
            />
          )}

          {viewMode === "graph" && (
            <div className="mt-6 rounded-lg p-4" style={{ background: "var(--surface-hover)", border: "1px solid var(--accent-border)" }}>
              {!graphPayload.data.length ? (
                <p className="text-sm text-center" style={{ color: "var(--text-sub)" }}>
                  Graph view is not available for this dataset.
                </p>
              ) : (
                <div className="w-full h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {graphPayload.chartType === "multi-line" ? (
                      <LineChart data={graphPayload.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                        <XAxis dataKey={graphPayload.xKey} tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        {graphPayload.yKeys.map((key, index) => (
                          <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={["var(--accent)", "var(--blue)", "var(--red)", "var(--accent-secondary)", "var(--orange)"][index % 5]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        ))}
                      </LineChart>
                    ) : (
                      <BarChart data={graphPayload.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                        <XAxis dataKey={graphPayload.xKey} tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        {graphPayload.yKeys.map((key, index) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={["var(--accent)", "var(--blue)", "var(--red)", "var(--accent-secondary)", "var(--orange)"][index % 5]}
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportDetailView;
