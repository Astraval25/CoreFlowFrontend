import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useDashboard } from "./hooks/useDashboard";
import {
  MdClose,
  MdPayments,
  MdPerson,
  MdReceipt,
  MdShoppingCart,
  MdStore,
  MdTrendingDown,
  MdTrendingUp,
} from "react-icons/md";
import { FiArrowUpRight } from "react-icons/fi";
import StyledDropdown from "../../shared/components/StyledDropdown";
import { coreApi } from "../../shared/services/coreApi";
import AdminAnnouncementModal from "../announcements/components/AdminAnnouncementModal";
import { OrderPaymentActivityGraph } from "../../shared/components/PartyMonthlyTrend";

/* ─── helpers ─── */
const fmt = (val) =>
  `₹${Number(val ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateKey = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const textClassForThemeColor = (color) =>
  ({
    "var(--accent)": "text-brand",
    "var(--red)": "text-danger",
    "var(--blue)": "text-info",
    "var(--text-main)": "text-app-text",
  }[color] || "text-app-text");
const shortMonth = (s) => {
  if (!s) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[parseInt(s.split("-")[1], 10) - 1] ?? s;
};

const TABS = ["Dashboard", "Getting Started", "Recent Updates"];
const RANGE_OPTIONS = [
  { value: "current_fy_year", label: "Current financial Year" },
  { value: "current_month", label: "Current Month" },
  { value: "half", label: "Half" },
  { value: "quarter", label: "Quarter" },
  { value: "prev_fy_year", label: "Prev financial Year" },
];
const ORDER_HISTORY_OPTIONS = [
  { value: "ALL", label: "All Orders" },
  { value: "SALES", label: "Sales" },
  { value: "PURCHASE", label: "Purchase" },
];
const PAYMENT_HISTORY_OPTIONS = [
  { value: "ALL", label: "All Payments" },
  { value: "RECEIVED", label: "Received" },
  { value: "MADE", label: "Made" },
];

/* ─── Ad Banner ─── */
const AdBanner = () => {
  const [ads, setAds] = useState([]);
  const [imgUrls, setImgUrls] = useState({});
  const [dismissed, setDismissed] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    coreApi.getActiveAds("dashboard")
      .then(async (res) => {
        if (cancelled) return;
        const list = res?.data?.responseData?.advertisements
          ?? (Array.isArray(res?.data?.responseData) ? res.data.responseData : []);
        setAds(list);

        // download all images in parallel
        const fsIds = [...new Set(list.map((a) => a.fsId).filter(Boolean))];
        if (fsIds.length > 0) {
          const results = await Promise.allSettled(
            fsIds.map((fsId) =>
              coreApi.downloadFile(fsId).then((r) => ({ fsId, url: URL.createObjectURL(r.data) }))
            )
          );
          if (cancelled) return;
          const urls = {};
          results.forEach((r) => { if (r.status === "fulfilled") urls[r.value.fsId] = r.value.url; });
          setImgUrls(urls);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // cleanup object URLs on unmount
  useEffect(() => () => Object.values(imgUrls).forEach((u) => URL.revokeObjectURL(u)), [imgUrls]);

  const visibleAds = ads.filter((ad) => !dismissed.has(ad.adId));
  if (loading || visibleAds.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {visibleAds.map((ad) => (
        <div
          key={ad.adId}
          className="relative rounded-xl overflow-hidden cursor-pointer shrink-0"
          style={{
            border: "1px solid var(--line)",
            background: "var(--surface-soft)",
            width: visibleAds.length === 1 ? "100%" : "calc(50% - 6px)",
            minWidth: 260,
          }}
          onClick={() => ad.actionUrl && window.open(ad.actionUrl, "_blank", "noopener")}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed((prev) => new Set(prev).add(ad.adId)); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10 bg-overlay-strong text-surface"
          >
            <MdClose size={14} />
          </button>
          {imgUrls[ad.fsId] ? (
            <img src={imgUrls[ad.fsId]} alt={ad.description || "Ad"} className="w-full h-32 object-cover" />
          ) : (
            <div className="flex items-center gap-3 p-4 h-32">
              <div className="flex-1">
                <p className="text-sm font-semibold text-app-text">
                  {ad.companyName}{ad.itemName ? ` — ${ad.itemName}` : ""}
                </p>
                {ad.description && (
                  <p className="text-xs mt-1 text-app-sub">{ad.description}</p>
                )}
              </div>
              <FiArrowUpRight size={18} className="shrink-0 text-brand" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Detail Modal ─── */
const DetailModal = ({ title, rows, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
    onClick={onClose}
  >
    <div
      className="card w-full max-w-sm mx-4 p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-sm text-app-text">{title}</p>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-app-sub"
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MdClose size={16} />
        </button>
      </div>
      <div className="space-y-2.5">
        {rows.map(({ label, value, accent }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-line">
            <span className="text-xs text-app-sub">{label}</span>
            <span className={`text-xs font-bold ${textClassForThemeColor(accent)}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Cash Flow custom tooltip ─── */
const CashFlowTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload ?? {};
  return (
    <div className="card min-w-[190px] px-4 py-3 text-xs space-y-1.5">
      <p className="font-bold mb-2 text-app-text">{label}</p>
      {[
        { label: "Opening Balance", value: fmt(d.openingBalance), color: "var(--blue)" },
        { label: "Incoming",        value: fmt(d.incoming),       color: "var(--accent)" },
        { label: "Outgoing",        value: fmt(d.outgoing),       color: "var(--red)" },
        { label: "Closing Balance", value: fmt(d.closingBalance), color: "var(--text-main)" },
      ].map(({ label: l, value, color }) => (
        <div key={l} className="flex justify-between gap-4">
          <span className="text-app-sub">{l}</span>
          <span className={`font-semibold ${textClassForThemeColor(color)}`}>{value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Revenue/Expense custom tooltip ─── */
const RevExpTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card min-w-[175px] px-4 py-3 text-xs space-y-1.5">
      <p className="font-bold mb-2 text-app-text">{label}</p>
      {payload.map(({ name, value, color }) => (
        <div key={name} className="flex justify-between gap-4">
          <span className="text-app-sub">{name}</span>
          <span className={`font-semibold ${textClassForThemeColor(color)}`}>{fmt(value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── KPI Card ─── */
const KpiCard = ({ title, amount, current, overdue }) => {
  const total = (current ?? 0) + (overdue ?? 0);
  const pct = total > 0 ? Math.round(((overdue ?? 0) / total) * 100) : 0;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-app-text">{title}</span>
        <button className="btn-outline text-xs py-1 px-2.5">+ New</button>
      </div>
      <p className="text-xs text-app-sub">
        {title === "Total Receivables" ? "Total Unpaid Invoices" : "Total Unpaid Bills"}
      </p>
      <p className="text-2xl font-extrabold text-app-text">{fmt(amount)}</p>
      <div
        className="h-1.5 rounded-full overflow-hidden bg-surface-soft"
      >
          <div
          className="h-full rounded-full transition-all bg-warning"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center gap-5 text-xs text-app-sub">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block bg-brand" />
          Current : {fmt(current)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block bg-warning" />
          Overdue : {fmt(overdue)} ▾
        </span>
      </div>
    </div>
  );
};

/* ─── Cash Flow Card ─── */
const CashFlowCard = ({ data, range, onRangeChange, dateRange, loading = false }) => {
  const [modal, setModal] = useState(null);

  const chartData = data.map((d) => ({
    name:           shortMonth(d.month),
    closingBalance: d.closingBalance ?? 0,
    openingBalance: d.openingBalance ?? 0,
    incoming:       d.incoming ?? 0,
    outgoing:       d.outgoing ?? 0,
  }));

  const incoming = data.reduce((s, d) => s + (d.incoming ?? 0), 0);
  const outgoing = data.reduce((s, d) => s + (d.outgoing ?? 0), 0);
  const closing  = data[data.length - 1]?.closingBalance ?? 0;

  const startLabel = dateRange.startDate.split("-").reverse().join("/");
  const endLabel   = dateRange.endDate.split("-").reverse().join("/");

  const handleClick = useCallback((e) => {
    if (!e?.activePayload?.length) return;
    const d = e.activePayload[0].payload;
    setModal({
      title: `Cash Flow — ${d.name}`,
      rows: [
        { label: "Opening Balance", value: fmt(d.openingBalance), accent: "var(--blue)" },
        { label: "Incoming",        value: fmt(d.incoming),       accent: "var(--accent)" },
        { label: "Outgoing",        value: fmt(d.outgoing),       accent: "var(--red)" },
        { label: "Closing Balance", value: fmt(d.closingBalance), accent: "var(--text-main)" },
      ],
    });
  }, []);

  return (
    <>
      {modal && <DetailModal {...modal} onClose={() => setModal(null)} />}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-app-text">Cash Flow</span>
          <div className="flex items-center gap-2">
            {loading && <span className="text-[10px] text-app-muted">Updating...</span>}
            <StyledDropdown value={range} onChange={onRangeChange} options={RANGE_OPTIONS} disabled={loading} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 min-h-[200px] cursor-pointer" title="Click a point for details">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 10, bottom: 0, left: 0 }}
                onClick={handleClick}
              >
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-sub)" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-sub)" }} axisLine={false} tickLine={false} width={52}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CashFlowTooltip />} />
                <Area
                  type="monotone" dataKey="closingBalance" stroke="var(--accent)" strokeWidth={2}
                  fill="url(#cashGrad)"
                  dot={{ r: 4, fill: "var(--accent)", strokeWidth: 2, stroke: "var(--surface-bg)", cursor: "pointer" }}
                  activeDot={{ r: 6, fill: "var(--accent)", stroke: "var(--surface-bg)", strokeWidth: 2, cursor: "pointer" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          
          </div>

          {/* Summary panel */}
          <div className="flex flex-col gap-2 lg:w-52 justify-center text-xs">
            <p className="text-[11px] font-medium mb-1 text-app-sub">
              Cash as on {startLabel}
            </p>
            {[
              { dotClass: "bg-brand", label: "Incoming",        value: `${fmt(incoming)} (+)` },
              { dotClass: "bg-danger", label: "Outgoing",       value: `${fmt(outgoing)} (−)` },
              { dotClass: "bg-info", label: `Cash as on ${endLabel}`, value: `${fmt(closing)} (=)` },
            ].map(({ dotClass, label, value }) => (
              <div
                key={label}
                className="flex justify-between items-start py-2.5 border-b border-line"
              >
                <span className="flex items-center gap-1.5 text-app-sub">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                  {label}
                </span>
                <span className="font-semibold ml-2 text-right text-app-text">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Income & Expense Card ─── */
const RevenueExpenseCard = ({ data, range, onRangeChange, loading = false }) => {
  const [modal, setModal] = useState(null);

  const chartData = data.map((d) => ({
    name:    shortMonth(d.month),
    Revenue: d.revenue ?? 0,
    Expense: d.expense ?? 0,
    netProfit: d.netProfit ?? 0,
  }));

  const last = data[data.length - 1] ?? {};
  const totalRevenue = last.runningRevenue ?? 0;
  const totalExpense = last.runningExpense ?? 0;

  const handleClick = useCallback((e) => {
    if (!e?.activePayload?.length) return;
    const d = e.activePayload[0].payload;
    setModal({
      title: `Income & Expense — ${d.name}`,
      rows: [
        { label: "Revenue",    value: fmt(d.Revenue),    accent: "var(--accent)" },
        { label: "Expense",    value: fmt(d.Expense),    accent: "var(--red)" },
        { label: "Net Profit", value: fmt(d.netProfit),  accent: d.netProfit >= 0 ? "var(--accent)" : "var(--red)" },
      ],
    });
  }, []);

  return (
    <>
      {modal && <DetailModal {...modal} onClose={() => setModal(null)} />}
      <div className="card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-app-text">Income and Expense</span>
          <div className="flex items-center gap-2">
            {loading && <span className="text-[10px] text-app-muted">Updating...</span>}
            <StyledDropdown value={range} onChange={onRangeChange} options={RANGE_OPTIONS} disabled={loading} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-extrabold">
          <span className="text-brand">{fmt(totalRevenue)}</span>
          <span className="text-danger">{fmt(totalExpense)}</span>
        </div>

        <div className="cursor-pointer" title="Click a bar for details">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              barSize={7} barGap={2}
              onClick={handleClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-sub)" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text-sub)" }} axisLine={false} tickLine={false} width={42}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<RevExpTooltip />} />
              <Bar dataKey="Revenue" fill="var(--accent)" radius={[3, 3, 0, 0]} cursor="pointer" />
              <Bar dataKey="Expense" fill="var(--red)"    radius={[3, 3, 0, 0]} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[10px] text-app-muted">
          * Income and expense values are exclusive of taxes.
        </p>
      </div>
    </>
  );
};

/* ─── Top Expenses Card ─── */
const TopExpensesCard = ({ kpi, range, onRangeChange, loading = false }) => {
  const [modal, setModal] = useState(null);
  const totalExpense = kpi?.totalExpense ?? 0;

  const pieData = totalExpense > 0
    ? [{ name: "Cost of Goods Sold", value: totalExpense }]
    : [{ name: "No Data", value: 1 }];

  const handleClick = useCallback(() => {
    if (!totalExpense) return;
    setModal({
      title: "Top Expenses — This Month",
      rows: [
        { label: "Total Expense",       value: fmt(totalExpense),        accent: "var(--red)" },
        { label: "Cost of Goods Sold",  value: fmt(totalExpense),        accent: "var(--accent)" },
        { label: "Net Profit",          value: fmt(kpi?.netProfit ?? 0), accent: (kpi?.netProfit ?? 0) >= 0 ? "var(--accent)" : "var(--red)" },
      ],
    });
  }, [totalExpense, kpi]);

  return (
    <>
      {modal && <DetailModal {...modal} onClose={() => setModal(null)} />}
      <div className="card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-app-text">Top Expenses</span>
          <div className="flex items-center gap-2">
            {loading && <span className="text-[10px] text-app-muted">Updating...</span>}
            <StyledDropdown value={range} onChange={onRangeChange} options={RANGE_OPTIONS} disabled={loading} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-2 cursor-pointer" onClick={handleClick} title="Click for details">
          <div className="relative">
            <PieChart width={170} height={170}>
              <Pie
                data={pieData}
                cx={80} cy={80}
                innerRadius={54} outerRadius={76}
                dataKey="value"
                startAngle={90} endAngle={-270}
                strokeWidth={0}
              >
                <Cell fill={totalExpense > 0 ? "var(--accent)" : "var(--line)"} />
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] text-app-sub">All Expenses</span>
              <span className="text-sm font-extrabold text-app-text">{fmt(totalExpense)}</span>
            </div>
          </div>
          {totalExpense > 0 && (
            <div className="flex items-center gap-2 text-xs mt-1 text-app-sub">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand" />
              Cost of Goods Sold
              <span className="font-bold text-app-text">{fmt(totalExpense)}</span>
            </div>
          )}
          <p className="text-[10px] mt-2 text-app-muted">Click for details</p>
        </div>
      </div>
    </>
  );
};

/* ─── KPI Summary Strip ─── */
const KpiStrip = ({ kpi }) => {
  const items = [
    { label: "Total Revenue",  value: fmt(kpi?.totalRevenue),  icon: <MdTrendingUp size={16} />,   color: "var(--accent)" },
    { label: "Total Expense",  value: fmt(kpi?.totalExpense),  icon: <MdTrendingDown size={16} />, color: "var(--red)" },
    { label: "Net Profit",     value: fmt(kpi?.netProfit),     icon: <FiArrowUpRight size={14} />, color: (kpi?.netProfit ?? 0) >= 0 ? "var(--accent)" : "var(--red)" },
    { label: "Sales Orders",   value: kpi?.totalSalesOrders ?? 0,    icon: null, color: "var(--blue)" },
    { label: "Purchase Orders",value: kpi?.totalPurchaseOrders ?? 0, icon: null, color: "var(--blue)" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(({ label, value, icon, color }) => (
        <div key={label} className="card p-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-app-sub">{label}</span>
            {icon && <span className={textClassForThemeColor(color)}>{icon}</span>}
          </div>
          <span className={`text-base font-extrabold ${textClassForThemeColor(color)}`}>{value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Skeleton ─── */
const Skeleton = ({ h = "h-40" }) => (
  <div className={`card p-5 ${h} animate-pulse bg-surface`}>
    <div className="h-4 rounded mb-3 w-1/3 bg-surface-soft" />
    <div className="h-full rounded bg-surface-soft" />
  </div>
);

/* ─── Dashboard Page ─── */
const badgeClassForStatus = (status = "") => {
  const s = status.toUpperCase();
  if (s.includes("FAILED") || s.includes("DECLINED") || s.includes("CANCELLED")) return "badge-red";
  if (s.includes("PARTIAL") || s.includes("VIEWED")) return "badge-orange";
  if (s.includes("PAID") || s.includes("ORDER_INVOICED")) return "badge-blue";
  return "badge-gray";
};

const orderDetailPath = (companyId, order) =>
  order.orderType === "PURCHASE"
    ? `/cf/company/${companyId}/purchase/${order.orderId}/detail`
    : `/cf/company/${companyId}/sales/${order.orderId}/detail`;

const paymentDetailPath = (companyId, payment) =>
  payment.paymentType === "MADE"
    ? `/cf/company/${companyId}/payment-made/${payment.paymentId}/detail`
    : `/cf/company/${companyId}/payment-received/${payment.paymentId}/detail`;

const buildDashboardActivityTrend = (orders, payments) => {
  const rowsByDay = new Map();
  const ensureDay = (date) => {
    const key = formatDateKey(date);
    if (!key) return null;
    if (!rowsByDay.has(key)) {
      rowsByDay.set(key, {
        day: key,
        orderAmount: 0,
        paidAmount: 0,
        totalQuantity: 0,
      });
    }
    return rowsByDay.get(key);
  };

  orders.forEach((order) => {
    const day = ensureDay(order.orderDate);
    if (!day) return;
    day.orderAmount += Number(order.totalAmount ?? 0);
    day.totalQuantity += Number(order.totalQuantity ?? order.quantity ?? 0);
  });

  payments.forEach((payment) => {
    const day = ensureDay(payment.paymentDate);
    if (!day) return;
    day.paidAmount += Number(payment.amount ?? 0);
  });

  return [...rowsByDay.values()].sort((a, b) => a.day.localeCompare(b.day));
};

const TransactionRow = ({ title, partyName, date, status, amount, meta, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left rounded-lg border border-line bg-surface px-3 py-3 transition-all hover:border-brand hover:bg-surface-muted"
  >
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-xs font-bold text-app-text">{title}</span>
            <span className="mt-1 block truncate text-[11px] text-app-sub">{partyName || "Unknown party"}</span>
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-xs font-extrabold tabular-nums text-app-text">{amount}</span>
            <span className="mt-1 block text-[10px] text-app-muted">{date}</span>
          </span>
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`badge ${badgeClassForStatus(status)}`}>{status || "-"}</span>
          {meta && <span className="text-[10px] font-medium text-app-sub">{meta}</span>}
        </span>
      </span>
    </div>
  </button>
);

const TransactionList = ({ title, subtitle, emptyText, rows, type, icon, onRowClick }) => (
  <div className="rounded-xl border border-line bg-surface-soft p-3">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold text-app-text">{title}</p>
        <p className="mt-0.5 text-[11px] text-app-sub">{subtitle}</p>
      </div>
      <span className="rounded-full bg-surface px-2 py-1 text-[10px] font-bold text-app-sub">
        {rows.length}
      </span>
    </div>
    <div className="space-y-2">
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-surface px-3 py-8 text-center text-xs text-app-sub">
          {emptyText}
        </div>
      ) : (
        rows.slice(0, 5).map((row) => {
          const isOrder = type === "order";
          return (
            <TransactionRow
              key={isOrder ? row.orderId : row.paymentId}
              title={
                isOrder
                  ? row.localOrderNumber || `#${row.orderId}`
                  : row.localPaymentNumber || `#${row.paymentId}`
              }
              partyName={row.partyName}
              date={formatDate(isOrder ? row.orderDate : row.paymentDate)}
              status={isOrder ? row.orderStatus : row.paymentStatus}
              amount={isOrder ? fmt(row.totalAmount) : fmt(row.amount)}
              meta={isOrder ? `${row.paidPercentage ?? 0}% paid` : row.modeOfPayment}
              icon={icon}
              onClick={() => onRowClick(row)}
            />
          );
        })
      )}
    </div>
  </div>
);

export const DashboardPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [cashFlowRange, setCashFlowRange] = useState("current_fy_year");
  const [revenueExpenseRange, setRevenueExpenseRange] = useState("current_fy_year");
  const [topExpensesRange, setTopExpensesRange] = useState("current_fy_year");
  const [overallRange, setOverallRange] = useState("current_fy_year");
  const [orderHistory, setOrderHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState({
    orderType: "ALL",
    paymentType: "ALL",
  });
  const [historyLoading, setHistoryLoading] = useState(false);

  const {
    kpi,
    summaryKpi,
    cashFlow,
    revenueExpense,
    graphKpi,
    loading,
    summaryKpiLoading,
    cashFlowLoading,
    revenueExpenseLoading,
    topExpensesLoading,
    companyName,
    getDateRangeByPreset,
  } = useDashboard({
    cashFlowRange,
    revenueExpenseRange,
    topExpensesRange,
    summaryRange: overallRange,
  });

  const handleOverallRangeChange = (value) => {
    setOverallRange(value);
    setCashFlowRange(value);
    setRevenueExpenseRange(value);
    setTopExpensesRange(value);
  };

  const cashFlowDateRange = getDateRangeByPreset(cashFlowRange);
  const overallDateRange = getDateRangeByPreset(overallRange);
  const customerOrders = orderHistory.filter((order) => order.orderType === "SALES");
  const vendorOrders = orderHistory.filter((order) => order.orderType === "PURCHASE");
  const customerPayments = paymentHistory.filter((payment) => payment.paymentType === "RECEIVED");
  const vendorPayments = paymentHistory.filter((payment) => payment.paymentType === "MADE");
  const dashboardActivityTrend = useMemo(
    () => buildDashboardActivityTrend(orderHistory, paymentHistory),
    [orderHistory, paymentHistory]
  );

  useEffect(() => {
    if (!companyId) return;
    const { startDate, endDate } = getDateRangeByPreset(overallRange);
    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setHistoryLoading(true);
        return Promise.all([
          coreApi.getOrderHistory(companyId, startDate, endDate, {
            orderType: historyFilter.orderType,
          }),
          coreApi.getPaymentHistory(companyId, startDate, endDate, {
            paymentType: historyFilter.paymentType,
          }),
        ]);
      })
      .then(([ordersRes, paymentsRes]) => {
        if (cancelled || !ordersRes || !paymentsRes) return;
        setOrderHistory(ordersRes?.data?.responseData || []);
        setPaymentHistory(paymentsRes?.data?.responseData || []);
      })
      .catch(() => {
        if (cancelled) return;
        setOrderHistory([]);
        setPaymentHistory([]);
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, overallRange, historyFilter, getDateRangeByPreset]);

  return (
    <div className="flex flex-col gap-5">
      <AdminAnnouncementModal />

      {/* Header */}
      <div className="pt-1 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-app-text">
             Hello, {companyName} {/* {userName} */}
          </h1>
          <p className="text-xs mt-0.5 text-app-sub">{companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <span className="text-xs font-medium text-app-sub">
            Overall Duration:
          </span> */}
          <StyledDropdown
            value={overallRange}
            onChange={handleOverallRangeChange}
            options={RANGE_OPTIONS}
            disabled={cashFlowLoading || revenueExpenseLoading || topExpensesLoading}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-line flex gap-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={{
              borderBottomColor: activeTab === tab ? "var(--accent)" : "transparent",
              color: activeTab === tab ? "var(--accent)" : "var(--text-sub)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Dashboard tab ── */}
      {activeTab === "Dashboard" && (
        <>

          {/* KPI strip */}
          {(loading || (summaryKpiLoading && !summaryKpi))
            ? <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{[...Array(5)].map((_, i) => <Skeleton key={i} h="h-20" />)}</div>
            : <KpiStrip kpi={summaryKpi || kpi} />
          }

          {/* Ad Banner */}
          <AdBanner />

          <div className="card p-5">
            <OrderPaymentActivityGraph
              trend={dashboardActivityTrend}
              range={overallDateRange}
              title="Order and Payment Activity"
              subtitle="Daily activity across customers and vendors"
              loading={historyLoading}
              emptyText="No order or payment activity found for this dashboard period."
            />
          </div>

          {/* Receivables + Payables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading
              ? <><Skeleton h="h-36" /><Skeleton h="h-36" /></>
              : <>
                  <KpiCard title="Total Receivables" amount={kpi?.outstandingReceivables ?? 0} current={0} overdue={kpi?.outstandingReceivables ?? 0} />
                  <KpiCard title="Total Payables"    amount={kpi?.outstandingPayables ?? 0}    current={0} overdue={kpi?.outstandingPayables ?? 0} />
                </>
            }
          </div>

          {/* Cash Flow */}
          {(cashFlowLoading && cashFlow.length === 0)
            ? <Skeleton h="h-64" />
            : (
              <CashFlowCard
                data={cashFlow}
                range={cashFlowRange}
                onRangeChange={setCashFlowRange}
                dateRange={cashFlowDateRange}
                loading={cashFlowLoading}
              />
            )}

          {/* Income/Expense + Top Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(revenueExpenseLoading && revenueExpense.length === 0)
              ? <Skeleton h="h-72" />
              : (
                <RevenueExpenseCard
                  data={revenueExpense}
                  range={revenueExpenseRange}
                  onRangeChange={setRevenueExpenseRange}
                  loading={revenueExpenseLoading}
                />
              )}
            {(topExpensesLoading && !graphKpi)
              ? <Skeleton h="h-72" />
              : (
                <TopExpensesCard
                  kpi={graphKpi}
                  range={topExpensesRange}
                  onRangeChange={setTopExpensesRange}
                  loading={topExpensesLoading}
                />
              )}
          </div>

          <div className="card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-sm font-semibold text-app-text">History</span>
                <p className="mt-0.5 text-xs text-app-sub">Recent customer and vendor transactions</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StyledDropdown
                  value={historyFilter.orderType}
                  onChange={(value) =>
                    setHistoryFilter((prev) => ({ ...prev, orderType: value }))
                  }
                  options={ORDER_HISTORY_OPTIONS}
                />
                <StyledDropdown
                  value={historyFilter.paymentType}
                  onChange={(value) =>
                    setHistoryFilter((prev) => ({ ...prev, paymentType: value }))
                  }
                  options={PAYMENT_HISTORY_OPTIONS}
                />
                <button
                  className="btn-outline text-xs py-1 px-2.5"
                  onClick={() => navigate(`/cf/company/${companyId}/report`)}
                >
                  Open Report
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-app-text">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-soft text-brand">
                    <MdPerson size={15} />
                  </span>
                  Customer Transactions
                </div>
                <TransactionList
                  title="Sales Orders"
                  subtitle="Customer order activity"
                  emptyText="No customer orders for this period."
                  rows={customerOrders}
                  type="order"
                  icon={<MdShoppingCart size={16} />}
                  onRowClick={(order) => navigate(orderDetailPath(companyId, order))}
                />
                <TransactionList
                  title="Payments Received"
                  subtitle="Customer payment activity"
                  emptyText="No customer payments for this period."
                  rows={customerPayments}
                  type="payment"
                  icon={<MdReceipt size={16} />}
                  onRowClick={(payment) => navigate(paymentDetailPath(companyId, payment))}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-app-text">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-soft text-brand">
                    <MdStore size={15} />
                  </span>
                  Vendor Transactions
                </div>
                <TransactionList
                  title="Purchase Orders"
                  subtitle="Vendor order activity"
                  emptyText="No vendor orders for this period."
                  rows={vendorOrders}
                  type="order"
                  icon={<MdShoppingCart size={16} />}
                  onRowClick={(order) => navigate(orderDetailPath(companyId, order))}
                />
                <TransactionList
                  title="Payments Made"
                  subtitle="Vendor payment activity"
                  emptyText="No vendor payments for this period."
                  rows={vendorPayments}
                  type="payment"
                  icon={<MdPayments size={16} />}
                  onRowClick={(payment) => navigate(paymentDetailPath(companyId, payment))}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="card p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-1">
                <h3 className="text-sm font-extrabold mb-1 text-app-text">
                  Account on the go!
                </h3>
                <p className="text-xs max-w-xs text-app-sub">
                  Download the CoreFlow app for Android and iOS to manage your finances from anywhere, anytime!
                </p>
                <button className="mt-3 text-xs font-semibold flex items-center gap-1 text-brand">
                  Learn More <FiArrowUpRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-app-sub">
                {[
                  { heading: "Other", links: ["Ecommerce Software","Expense Reporting","Subscription Billing","100% Free Invoicing","Inventory Mgmt","CRM & Other Apps"] },
                  { heading: "Apps",  links: ["Knowledge Base","Mobile apps","Add-ons","What's New?","Developers API"] },
                  { heading: "Help & Support", links: ["Contact Support","Knowledge Base","Help Docs","Webinar"] },
                  { heading: "Quick Links",    links: ["Getting Started","Mobile apps","Add-ons","What's New?","Developers API"] },
                ].map(({ heading, links }) => (
                  <div key={heading}>
                    <p className="font-bold mb-2 text-[10px] uppercase tracking-wider text-app-text">
                      {heading}
                    </p>
                    <ul className="space-y-1.5">
                      {links.map((l) => (
                        <li
                          key={l}
                          className="cursor-pointer transition-colors hover:underline text-app-sub"
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-sub)")}
                        >
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="mt-5 pt-4 flex justify-between text-[10px] border-t border-line text-app-muted"
            >
              <span>© 2026.</span>
              <span>All Rights Reserved.</span>
            </div>
          </div>
        </>
      )}

      {activeTab === "Getting Started" && (
        <div className="card p-10 text-center text-sm text-app-sub">
          Getting Started content coming soon.
        </div>
      )}

      {activeTab === "Recent Updates" && (
        <div className="card p-10 text-center text-sm text-app-sub">
          No recent updates.
        </div>
      )}
    </div>
  );
};
