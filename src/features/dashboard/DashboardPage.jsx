import { useState, useEffect, useCallback } from "react";
import {
    LineChart,
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
import { MdClose, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { FiArrowUpRight } from "react-icons/fi";
import StyledDropdown from "../../shared/components/StyledDropdown";
import { coreApi } from "../../shared/services/coreApi";

/* ─── helpers ─── */
const fmt = (val) =>
  `₹${Number(val ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

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

/* ─── Ad Banner ─── */
const AdBanner = () => {
  const [ads, setAds] = useState([]);
  const [imgUrls, setImgUrls] = useState({});
  const [dismissed, setDismissed] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
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
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10"
            style={{ background: "var(--overlay-bg-strong)", color: "var(--surface-bg)" }}
          >
            <MdClose size={14} />
          </button>
          {imgUrls[ad.fsId] ? (
            <img src={imgUrls[ad.fsId]} alt={ad.description || "Ad"} className="w-full h-32 object-cover" />
          ) : (
            <div className="flex items-center gap-3 p-4 h-32">
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
                  {ad.companyName}{ad.itemName ? ` — ${ad.itemName}` : ""}
                </p>
                {ad.description && (
                  <p className="text-xs mt-1" style={{ color: "var(--text-sub)" }}>{ad.description}</p>
                )}
              </div>
              <FiArrowUpRight size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
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
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: "var(--overlay-bg)" }}
    onClick={onClose}
  >
    <div
      className="card w-full max-w-sm mx-4 p-5"
      style={{ boxShadow: "var(--shadow-md)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-sm" style={{ color: "var(--text-main)" }}>{title}</p>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--text-sub)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MdClose size={16} />
        </button>
      </div>
      <div className="space-y-2.5">
        {rows.map(({ label, value, accent }) => (
          <div key={label} className="flex items-center justify-between py-2"
            style={{ borderBottom: "1px solid var(--line)" }}>
            <span className="text-xs" style={{ color: "var(--text-sub)" }}>{label}</span>
            <span
              className="text-xs font-bold"
              style={{ color: accent ?? "var(--text-main)" }}
            >
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
    <div
      className="card px-4 py-3 text-xs space-y-1.5"
      style={{ minWidth: 190, boxShadow: "var(--shadow-md)" }}
    >
      <p className="font-bold mb-2" style={{ color: "var(--text-main)" }}>{label}</p>
      {[
        { label: "Opening Balance", value: fmt(d.openingBalance), color: "var(--blue)" },
        { label: "Incoming",        value: fmt(d.incoming),       color: "var(--accent)" },
        { label: "Outgoing",        value: fmt(d.outgoing),       color: "var(--red)" },
        { label: "Closing Balance", value: fmt(d.closingBalance), color: "var(--text-main)" },
      ].map(({ label: l, value, color }) => (
        <div key={l} className="flex justify-between gap-4">
          <span style={{ color: "var(--text-sub)" }}>{l}</span>
          <span style={{ color, fontWeight: 600 }}>{value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Revenue/Expense custom tooltip ─── */
const RevExpTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="card px-4 py-3 text-xs space-y-1.5"
      style={{ minWidth: 175, boxShadow: "var(--shadow-md)" }}
    >
      <p className="font-bold mb-2" style={{ color: "var(--text-main)" }}>{label}</p>
      {payload.map(({ name, value, color }) => (
        <div key={name} className="flex justify-between gap-4">
          <span style={{ color: "var(--text-sub)" }}>{name}</span>
          <span style={{ color, fontWeight: 600 }}>{fmt(value)}</span>
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
        <span className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>{title}</span>
        <button className="btn-outline text-xs py-1 px-2.5">+ New</button>
      </div>
      <p className="text-xs" style={{ color: "var(--text-sub)" }}>
        {title === "Total Receivables" ? "Total Unpaid Invoices" : "Total Unpaid Bills"}
      </p>
      <p className="text-2xl font-extrabold" style={{ color: "var(--text-main)" }}>{fmt(amount)}</p>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--surface-soft)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: "var(--orange)" }}
        />
      </div>
      <div className="flex items-center gap-5 text-xs" style={{ color: "var(--text-sub)" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--accent)" }} />
          Current : {fmt(current)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--orange)" }} />
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
          <span className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Cash Flow</span>
          <div className="flex items-center gap-2">
            {loading && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Updating...</span>}
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
            <p className="text-[11px] font-medium mb-1" style={{ color: "var(--text-sub)" }}>
              Cash as on {startLabel}
            </p>
            {[
              { dot: "var(--accent)", label: "Incoming",        value: `${fmt(incoming)} (+)` },
              { dot: "var(--red)",    label: "Outgoing",        value: `${fmt(outgoing)} (−)` },
              { dot: "var(--blue)",   label: `Cash as on ${endLabel}`, value: `${fmt(closing)} (=)` },
            ].map(({ dot, label, value }) => (
              <div
                key={label}
                className="flex justify-between items-start py-2.5"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <span className="flex items-center gap-1.5" style={{ color: "var(--text-sub)" }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
                  {label}
                </span>
                <span className="font-semibold ml-2 text-right" style={{ color: "var(--text-main)" }}>
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
          <span className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Income and Expense</span>
          <div className="flex items-center gap-2">
            {loading && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Updating...</span>}
            <StyledDropdown value={range} onChange={onRangeChange} options={RANGE_OPTIONS} disabled={loading} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-extrabold">
          <span style={{ color: "var(--accent)" }}>{fmt(totalRevenue)}</span>
          <span style={{ color: "var(--red)" }}>{fmt(totalExpense)}</span>
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

        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
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
          <span className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Top Expenses</span>
          <div className="flex items-center gap-2">
            {loading && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Updating...</span>}
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
              <span className="text-[10px]" style={{ color: "var(--text-sub)" }}>All Expenses</span>
              <span className="text-sm font-extrabold" style={{ color: "var(--text-main)" }}>{fmt(totalExpense)}</span>
            </div>
          </div>
          {totalExpense > 0 && (
            <div className="flex items-center gap-2 text-xs mt-1" style={{ color: "var(--text-sub)" }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--accent)" }} />
              Cost of Goods Sold
              <span className="font-bold" style={{ color: "var(--text-main)" }}>{fmt(totalExpense)}</span>
            </div>
          )}
          <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>Click for details</p>
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
            <span className="text-[11px]" style={{ color: "var(--text-sub)" }}>{label}</span>
            {icon && <span style={{ color }}>{icon}</span>}
          </div>
          <span className="text-base font-extrabold" style={{ color }}>{value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Skeleton ─── */
const Skeleton = ({ h = "h-40" }) => (
  <div className={`card p-5 ${h} animate-pulse`} style={{ background: "var(--surface-bg)" }}>
    <div className="h-4 rounded mb-3 w-1/3" style={{ background: "var(--surface-soft)" }} />
    <div className="h-full rounded" style={{ background: "var(--surface-soft)" }} />
  </div>
);

/* ─── Dashboard Page ─── */
export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [cashFlowRange, setCashFlowRange] = useState("current_fy_year");
  const [revenueExpenseRange, setRevenueExpenseRange] = useState("current_fy_year");
  const [topExpensesRange, setTopExpensesRange] = useState("current_fy_year");
  const [overallRange, setOverallRange] = useState("current_fy_year");

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
    userName,
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

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="pt-1 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--text-main)" }}>
            Hello, {userName}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-sub)" }}>{companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>
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
      <div style={{ borderBottom: "1px solid var(--line)" }} className="flex gap-0">
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

          {/* Footer */}
          <div className="card p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-1">
                <h3 className="text-sm font-extrabold mb-1" style={{ color: "var(--text-main)" }}>
                  Account on the go!
                </h3>
                <p className="text-xs max-w-xs" style={{ color: "var(--text-sub)" }}>
                  Download the CoreFlow app for Android and iOS to manage your finances from anywhere, anytime!
                </p>
                <button className="mt-3 text-xs font-semibold flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  Learn More <FiArrowUpRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs" style={{ color: "var(--text-sub)" }}>
                {[
                  { heading: "Other", links: ["Ecommerce Software","Expense Reporting","Subscription Billing","100% Free Invoicing","Inventory Mgmt","CRM & Other Apps"] },
                  { heading: "Apps",  links: ["Knowledge Base","Mobile apps","Add-ons","What's New?","Developers API"] },
                  { heading: "Help & Support", links: ["Contact Support","Knowledge Base","Help Docs","Webinar"] },
                  { heading: "Quick Links",    links: ["Getting Started","Mobile apps","Add-ons","What's New?","Developers API"] },
                ].map(({ heading, links }) => (
                  <div key={heading}>
                    <p className="font-bold mb-2 text-[10px] uppercase tracking-wider" style={{ color: "var(--text-main)" }}>
                      {heading}
                    </p>
                    <ul className="space-y-1.5">
                      {links.map((l) => (
                        <li
                          key={l}
                          className="cursor-pointer transition-colors hover:underline"
                          style={{ color: "var(--text-sub)" }}
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
              className="mt-5 pt-4 flex justify-between text-[10px]"
              style={{ borderTop: "1px solid var(--line)", color: "var(--text-muted)" }}
            >
              <span>© 2026.</span>
              <span>All Rights Reserved.</span>
            </div>
          </div>
        </>
      )}

      {activeTab === "Getting Started" && (
        <div className="card p-10 text-center text-sm" style={{ color: "var(--text-sub)" }}>
          Getting Started content coming soon.
        </div>
      )}

      {activeTab === "Recent Updates" && (
        <div className="card p-10 text-center text-sm" style={{ color: "var(--text-sub)" }}>
          No recent updates.
        </div>
      )}
    </div>
  );
};







