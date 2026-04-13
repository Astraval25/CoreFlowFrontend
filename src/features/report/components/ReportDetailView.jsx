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
          <tr style={{ background: "#f6f7fb", borderBottom: "1px solid var(--line)" }}>
            {columns.map((column) => (
              <th
                key={column}
                className="px-5 py-3 text-left text-[11px] uppercase tracking-wide"
                style={{ color: "#666c8f" }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${JSON.stringify(row)}`} style={{ borderBottom: "1px solid #edf0f6" }}>
              {columns.map((column) => (
                <td key={column} className="px-5 py-3 text-sm" style={{ color: "#111827" }}>
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
            p { margin: 0 0 16px 0; color: #555; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d9dee8; padding: 8px; text-align: left; }
            th { background: #f4f6fb; }
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
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#ffffff", borderBottom: "1px solid #e5e7ef" }}>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid #d8deed", background: "#f8faff" }}
            onClick={onBack}
          >
            <MdArrowBack size={18} style={{ color: "#304268" }} />
          </button>
          <div>
            <p className="text-xs" style={{ color: "#667390" }}>{selectedReport?.category || "Report"}</p>
            <h2 className="text-3xl font-semibold" style={{ color: "#1f2b46" }}>{selectedReport?.name || "Report"}</h2>
            <p className="text-xs mt-1" style={{ color: "#667390" }}>
              From {formatDatePretty(startDate)} to {formatDatePretty(endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg overflow-hidden" style={{ border: "1px solid #d8deed" }}>
            <button
              className="px-3 py-2 text-sm"
              style={{
                background: viewMode === "table" ? "#eef3ff" : "#fff",
                color: "#2e3d62",
              }}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
            <button
              className="px-3 py-2 text-sm"
              style={{
                background: viewMode === "graph" ? "#eef3ff" : "#fff",
                color: "#2e3d62",
                borderLeft: "1px solid #d8deed",
              }}
              onClick={() => setViewMode("graph")}
            >
              Graph
            </button>
          </div>

          <div className="relative">
            <button
              className="px-3 py-2 rounded-lg text-sm inline-flex items-center gap-1"
              style={{ border: "1px solid #d8deed", color: "#2e3d62", background: "#fff" }}
              onClick={() => setExportOpen((prev) => !prev)}
            >
              Export
              <MdKeyboardArrowDown size={16} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-lg shadow-lg z-20" style={{ background: "#fff", border: "1px solid #d8deed" }}>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#f4f7ff]"
                  onClick={exportExcel}
                >
                  Excel
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#f4f7ff]"
                  onClick={exportPdf}
                >
                  PDF
                </button>
              </div>
            )}
          </div>

          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid #d8deed", color: "#2e3d62", background: "#fff" }}
            onClick={loadReports}
            disabled={loading}
          >
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 py-3 flex flex-wrap items-center gap-2" style={{ background: "#f9faff", borderBottom: "1px solid #e3e7f1" }}>
        <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#2a3a5d" }}>
          <MdFilterList size={18} /> Filters:
        </span>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ border: "1px solid #d8deed", background: "#fff", color: "#25355a" }}>
          <MdCalendarToday size={14} />
          <span>Date Range</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs outline-none" />
          <span>-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs outline-none" />
        </div>

        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "#6fa2ff", color: "#fff" }}
          onClick={loadReports}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Report"}
        </button>
      </div>

      <div className="p-4 h-[calc(100vh-235px)] overflow-auto" style={{ background: "#f6f7fc" }}>
        {error && (
          <div className="mb-3 px-3 py-2 rounded text-sm" style={{ background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c" }}>
            {error}
          </div>
        )}

        <div className="rounded-xl p-4" style={{ border: "1px solid #e2e7f3", background: "#ffffff" }}>
          <div className="mb-5">
            <p className="text-sm" style={{ color: "#68789b" }}>{companyName}</p>
          </div>

          <div className="text-center mb-4">
            <h3 className="text-4xl font-semibold" style={{ color: "#1f2b46" }}>{selectedReport?.name || "Report"}</h3>
            <p className="text-sm mt-1" style={{ color: "#657594" }}>
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
            <div className="mt-6 rounded-lg p-4" style={{ background: "#f8faff", border: "1px solid #dbe6ff" }}>
              {!graphPayload.data.length ? (
                <p className="text-sm text-center" style={{ color: "#667390" }}>
                  Graph view is not available for this dataset.
                </p>
              ) : (
                <div className="w-full h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {graphPayload.chartType === "multi-line" ? (
                      <LineChart data={graphPayload.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f5" />
                        <XAxis dataKey={graphPayload.xKey} tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        {graphPayload.yKeys.map((key, index) => (
                          <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={["#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#0891b2"][index % 5]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        ))}
                      </LineChart>
                    ) : (
                      <BarChart data={graphPayload.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f5" />
                        <XAxis dataKey={graphPayload.xKey} tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        {graphPayload.yKeys.map((key, index) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={["#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#0891b2"][index % 5]}
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
