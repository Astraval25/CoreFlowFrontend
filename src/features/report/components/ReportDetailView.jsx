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
    return <p className="text-sm py-8 text-center text-app-muted">No records found for selected report.</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[560px]">
        <thead>
          <tr className="border-b border-line bg-surface-muted">
            {columns.map((column) => (
              <th
                key={column}
                className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-app-sub"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${JSON.stringify(row)}`} className="border-b border-line-soft">
              {columns.map((column) => (
                <td key={column} className="px-5 py-3 text-sm text-app-text">
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
      <div className="px-5 py-3 flex items-center justify-between border-b border-line bg-surface">
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-brand-field-border bg-surface-hover"
            onClick={onBack}
          >
            <MdArrowBack size={18} className="text-app-heading" />
          </button>
          <div>
            <p className="text-xs text-app-sub">{selectedReport?.category || "Report"}</p>
            <h2 className="text-3xl font-semibold text-app-text">{selectedReport?.name || "Report"}</h2>
            <p className="text-xs mt-1 text-app-sub">
              From {formatDatePretty(startDate)} to {formatDatePretty(endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg overflow-hidden border border-brand-field-border">
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
              className="px-3 py-2 rounded-lg text-sm inline-flex items-center gap-1 border border-brand-field-border bg-surface text-app-heading"
              onClick={() => setExportOpen((prev) => !prev)}
            >
              Export
              <MdKeyboardArrowDown size={16} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-lg shadow-lg z-20 border border-brand-field-border bg-surface">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover"
                  onClick={exportExcel}
                >
                  Excel
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover"
                  onClick={exportPdf}
                >
                  PDF
                </button>
              </div>
            )}
          </div>

          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-brand-field-border bg-surface text-app-heading"
            onClick={loadReports}
            disabled={loading}
          >
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 py-3 flex flex-wrap items-center gap-2 border-b border-line bg-surface-hover">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-app-heading">
          <MdFilterList size={18} /> Filters:
        </span>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-brand-field-border bg-surface text-app-heading">
          <MdCalendarToday size={14} />
          <span>Date Range</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs outline-none" />
          <span>-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs outline-none" />
        </div>

        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-surface"
          onClick={loadReports}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Report"}
        </button>
      </div>

      <div className="p-4 h-[calc(100vh-235px)] overflow-auto bg-app">
        {error && (
          <div className="mb-3 px-3 py-2 rounded text-sm border border-danger-alert-border bg-danger-alert-bg text-danger-alert-text">
            {error}
          </div>
        )}

        <div className="rounded-xl p-4 border border-line bg-surface">
          <div className="mb-5">
            <p className="text-sm text-app-sub">{companyName}</p>
          </div>

          <div className="text-center mb-4">
            <h3 className="text-4xl font-semibold text-app-text">{selectedReport?.name || "Report"}</h3>
            <p className="text-sm mt-1 text-app-sub">
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
            <div className="mt-6 rounded-lg p-4 border border-brand-border bg-surface-hover">
              {!graphPayload.data.length ? (
                <p className="text-sm text-center text-app-sub">
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
