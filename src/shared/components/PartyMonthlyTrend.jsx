import { useEffect, useMemo, useState } from "react";
import { MdClose, MdPayments, MdShoppingCart } from "react-icons/md";
import { coreApi } from "../services/coreApi";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getOneYearRange = () => {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() + 1);
  return {
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(end),
  };
};

const toDateKey = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return formatLocalDate(date);
};

const shortDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const shortMonth = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { month: "short" });
};

const fmtMoney = (value) =>
  `Rs ${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtNumber = (value) =>
  Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const getActivityScore = (row) =>
  Number(row?.orderAmount ?? 0) + Number(row?.paidAmount ?? 0) + Number(row?.totalQuantity ?? 0);

const getIntensityClass = (value, maxValue) => {
  if (!value || !maxValue) return "bg-surface-soft border-line";
  const pct = value / maxValue;
  if (pct >= 0.8) return "bg-brand border-brand";
  if (pct >= 0.55) return "bg-brand/80 border-brand/80";
  if (pct >= 0.32) return "bg-brand/60 border-brand/60";
  if (pct >= 0.14) return "bg-brand/35 border-brand/40";
  return "bg-brand/15 border-brand/25";
};

const buildDailyCells = (trend, range) => {
  const byDay = new Map(
    trend.map((row) => [
      toDateKey(row.day),
      {
        date: toDateKey(row.day),
        orderAmount: Number(row.orderAmount ?? 0),
        paidAmount: Number(row.paidAmount ?? 0),
        totalQuantity: Number(row.totalQuantity ?? 0),
      },
    ])
  );

  const start = new Date(`${range.startDate}T00:00:00`);
  const end = new Date(`${range.endDate}T00:00:00`);
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());
  const days = [];

  for (let date = new Date(gridStart); date <= end; date.setDate(date.getDate() + 1)) {
    const key = formatLocalDate(date);
    const row = byDay.get(key) || {
      date: key,
      orderAmount: 0,
      paidAmount: 0,
      totalQuantity: 0,
    };
    const inRange = date >= start && date <= end;
    days.push({
      ...row,
      id: key,
      label: shortDate(key),
      weekIndex: Math.floor((date - gridStart) / (7 * MS_PER_DAY)),
      dayIndex: date.getDay(),
      month: date.getDate() <= 7 ? shortMonth(key) : "",
      activity: inRange ? getActivityScore(row) : 0,
      muted: !inRange,
    });
  }

  return days;
};

const buildWeeklyCells = (dailyCells) => {
  const weekly = new Map();
  dailyCells.forEach((day) => {
    if (day.muted) return;
    const item = weekly.get(day.weekIndex) || {
      id: `week-${day.weekIndex}`,
      weekIndex: day.weekIndex,
      dayIndex: 0,
      label: `Week of ${day.label}`,
      orderAmount: 0,
      paidAmount: 0,
      totalQuantity: 0,
      activity: 0,
      month: day.month,
      days: 0,
    };
    item.orderAmount += day.orderAmount;
    item.paidAmount += day.paidAmount;
    item.totalQuantity += day.totalQuantity;
    item.activity += day.activity;
    item.days += 1;
    if (!item.month && day.month) item.month = day.month;
    weekly.set(day.weekIndex, item);
  });

  return [...weekly.values()].map((week, index) => ({
    ...week,
    dayIndex: index % 7,
    displayWeekIndex: Math.floor(index / 7),
  }));
};

const buildCumulativeCells = (dailyCells) => {
  let orderAmount = 0;
  let paidAmount = 0;
  let totalQuantity = 0;

  return dailyCells.map((day) => {
    if (!day.muted) {
      orderAmount += day.orderAmount;
      paidAmount += day.paidAmount;
      totalQuantity += day.totalQuantity;
    }
    return {
      ...day,
      orderAmount,
      paidAmount,
      totalQuantity,
      activity: orderAmount + paidAmount + totalQuantity,
    };
  });
};

const ActivityDetailModal = ({ item, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4" onClick={onClose}>
    <div className="card w-full max-w-sm p-5" onClick={(event) => event.stopPropagation()}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-app-text">{item.label}</p>
          <p className="mt-1 text-xs text-app-sub">Order and payment activity</p>
        </div>
        <button type="button" className="btn-ghost px-2 py-2" onClick={onClose} aria-label="Close details">
          <MdClose size={15} />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-surface-soft px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-app-sub">
            <MdShoppingCart size={15} className="text-brand" /> Order Amount
          </span>
          <span className="text-sm font-extrabold text-app-text">{fmtMoney(item.orderAmount)}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-surface-soft px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-app-sub">
            <MdPayments size={15} className="text-info" /> Payment Amount
          </span>
          <span className="text-sm font-extrabold text-app-text">{fmtMoney(item.paidAmount)}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-surface-soft px-3 py-2">
          <span className="text-xs font-semibold text-app-sub">Total Quantity</span>
          <span className="text-sm font-extrabold text-app-text">{fmtNumber(item.totalQuantity)}</span>
        </div>
      </div>
    </div>
  </div>
);

const ActivityTooltip = ({ item, position }) => (
  <div
    className="pointer-events-none fixed z-[60] w-56 rounded-lg border border-line bg-surface p-3 text-left text-xs shadow-lg"
    style={{ left: position.x, top: position.y }}
  >
    <p className="font-extrabold text-app-text">{item.label}</p>
    <div className="mt-2 flex justify-between gap-3 text-app-sub">
      <span>Orders</span>
      <span className="font-bold text-app-text">{fmtMoney(item.orderAmount)}</span>
    </div>
    <div className="mt-1 flex justify-between gap-3 text-app-sub">
      <span>Payments</span>
      <span className="font-bold text-app-text">{fmtMoney(item.paidAmount)}</span>
    </div>
    <div className="mt-1 flex justify-between gap-3 text-app-sub">
      <span>Quantity</span>
      <span className="font-bold text-app-text">{fmtNumber(item.totalQuantity)}</span>
    </div>
  </div>
);

const SummaryTile = ({ label, value, tone = "text-app-text" }) => (
  <div className="rounded-lg border border-line bg-surface-soft p-3">
    <p className="text-[11px] font-semibold text-app-sub">{label}</p>
    <p className={`mt-1 text-sm font-extrabold tabular-nums ${tone}`}>{value}</p>
  </div>
);

export const OrderPaymentActivityGraph = ({
  trend = [],
  range,
  title,
  subtitle,
  loading = false,
  error = "",
  emptyText = "No order or payment activity found for this period.",
}) => {
  const [mode, setMode] = useState("daily");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const updateHover = (item, event) => {
    if (item.muted) return;
    const tooltipWidth = 224;
    const tooltipHeight = 118;
    const padding = 12;
    const x = Math.min(event.clientX + padding, window.innerWidth - tooltipWidth - padding);
    const y = Math.max(padding, event.clientY - tooltipHeight - padding);
    setHovered({ item, position: { x, y } });
  };

  const dailyCells = useMemo(() => buildDailyCells(trend, range), [trend, range]);
  const visibleCells = useMemo(() => {
    if (mode === "weekly") return buildWeeklyCells(dailyCells);
    if (mode === "cumulative") return buildCumulativeCells(dailyCells);
    return dailyCells;
  }, [dailyCells, mode]);

  const maxActivity = Math.max(...visibleCells.map((item) => item.activity), 0);
  const columnCount = mode === "weekly"
    ? Math.max(...visibleCells.map((item) => item.displayWeekIndex ?? 0), 0) + 1
    : Math.max(...visibleCells.map((item) => item.weekIndex ?? 0), 0) + 1;

  const monthLabels = [];
  const seenMonths = new Set();
  dailyCells.forEach((item) => {
    if (!item.month || item.muted) return;
    const monthKey = item.date.slice(0, 7);
    if (seenMonths.has(monthKey)) return;
    seenMonths.add(monthKey);
    monthLabels.push({ label: item.month, weekIndex: item.weekIndex });
  });

  const summary = dailyCells.reduce(
    (acc, row) => ({
      orderAmount: acc.orderAmount + row.orderAmount,
      paidAmount: acc.paidAmount + row.paidAmount,
      totalQuantity: acc.totalQuantity + row.totalQuantity,
    }),
    { orderAmount: 0, paidAmount: 0, totalQuantity: 0 }
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-lg bg-surface-soft" />
          ))}
        </div>
        <div className="h-56 animate-pulse rounded-xl bg-surface-soft" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-line bg-surface-soft p-6 text-center text-sm text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selected && <ActivityDetailModal item={selected} onClose={() => setSelected(null)} />}
      {hovered && <ActivityTooltip item={hovered.item} position={hovered.position} />}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-app-text">{title}</h3>
          <p className="mt-1 text-xs text-app-sub">
            {subtitle || `Orders and payments from ${shortDate(range.startDate)} to ${shortDate(range.endDate)}`}
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-line bg-surface-soft p-1">
          {[
            { key: "daily", label: "Daily" },
            { key: "weekly", label: "Weekly" },
            { key: "cumulative", label: "Cumulative" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                mode === item.key ? "bg-surface text-app-text shadow-sm" : "text-app-sub hover:text-app-text"
              }`}
              onClick={() => setMode(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile label="Order Amount" value={fmtMoney(summary.orderAmount)} tone="text-brand" />
        <SummaryTile label="Payment Amount" value={fmtMoney(summary.paidAmount)} tone="text-info" />
        <SummaryTile label="Total Quantity" value={fmtNumber(summary.totalQuantity)} />
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        {visibleCells.some((item) => item.activity > 0) ? (
          <div className="thin-scroll overflow-x-auto pb-2">
            <div className="min-w-[760px]">
              {mode !== "weekly" && (
                <div
                  className="mb-2 grid gap-1 pl-7 text-[11px] font-semibold text-app-muted"
                  style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(10px, 1fr))` }}
                >
                  {monthLabels.map((item) => (
                    <span key={`${item.label}-${item.weekIndex}`} style={{ gridColumn: item.weekIndex + 1 }}>
                      {item.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <div className="grid h-[118px] w-5 grid-rows-7 text-[10px] font-semibold text-app-muted">
                  <span className="row-start-2">Mon</span>
                  <span className="row-start-4">Wed</span>
                  <span className="row-start-6">Fri</span>
                </div>
                <div
                  className="grid grid-flow-col grid-rows-7 gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${columnCount}, 14px)`,
                    gridAutoColumns: "14px",
                  }}
                >
                  {visibleCells.map((item) => {
                    const weekIndex = item.displayWeekIndex ?? item.weekIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`h-3.5 w-3.5 rounded-[3px] border transition hover:scale-125 hover:ring-2 hover:ring-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                          item.muted ? "bg-transparent border-transparent" : getIntensityClass(item.activity, maxActivity)
                        }`}
                        style={{
                          gridColumn: weekIndex + 1,
                          gridRow: item.dayIndex + 1,
                        }}
                        aria-label={`${item.label}: ${fmtMoney(item.orderAmount)} orders, ${fmtMoney(item.paidAmount)} payments`}
                        onMouseEnter={(event) => updateHover(item, event)}
                        onMouseMove={(event) => updateHover(item, event)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={(event) => {
                          const rect = event.currentTarget.getBoundingClientRect();
                          updateHover(item, { clientX: rect.left, clientY: rect.top });
                        }}
                        onBlur={() => setHovered(null)}
                        onClick={() => !item.muted && setSelected(item)}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-app-sub">
                <span>Hover or click a box to see order and payment details.</span>
                <span className="inline-flex items-center gap-1.5">
                  Less
                  <span className="h-3 w-3 rounded-[3px] border border-line bg-surface-soft" />
                  <span className="h-3 w-3 rounded-[3px] border border-brand/25 bg-brand/15" />
                  <span className="h-3 w-3 rounded-[3px] border border-brand/40 bg-brand/35" />
                  <span className="h-3 w-3 rounded-[3px] border border-brand/60 bg-brand/60" />
                  <span className="h-3 w-3 rounded-[3px] border border-brand bg-brand" />
                  More
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-52 items-center justify-center text-sm text-app-sub">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
};

const PartyMonthlyTrend = ({ companyId, partyId, partyType }) => {
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const range = useMemo(() => getOneYearRange(), []);
  const title = partyType === "vendor" ? "Vendor Activity" : "Customer Activity";

  useEffect(() => {
    if (!companyId || !partyId) return;

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setLoading(true);
        setError("");
        return partyType === "vendor"
          ? coreApi.getVendorOrderPaymentTrend(companyId, partyId, range.startDate, range.endDate)
          : coreApi.getCustomerOrderPaymentTrend(companyId, partyId, range.startDate, range.endDate);
      })
      .then((res) => {
        if (cancelled || !res) return;
        setTrend(res?.data?.responseData || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setTrend([]);
        setError(err?.response?.data?.responseMessage || "Unable to load order-payment activity");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, partyId, partyType, range.endDate, range.startDate]);

  return (
    <OrderPaymentActivityGraph
      trend={trend}
      range={range}
      title={title}
      loading={loading}
      error={error}
    />
  );
};

export default PartyMonthlyTrend;
