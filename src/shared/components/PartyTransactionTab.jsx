import { MdInbox, MdPayments, MdShoppingCart } from "react-icons/md";

const fmtMoney = (value) =>
  `Rs ${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const paidPercent = (order) => {
  const total = Number(order.totalAmount ?? 0);
  if (!total) return 0;
  return Math.min(100, Math.round((Number(order.paidAmount ?? 0) / total) * 100));
};

const TransactionCard = ({ icon, title, date, amount, badge, meta, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-lg border border-line bg-surface p-3 text-left transition hover:border-brand hover:bg-surface-muted"
  >
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-app-text">{title}</span>
            <span className="mt-1 block text-xs text-app-sub">{date}</span>
          </span>
          <span className="shrink-0 text-right text-sm font-extrabold tabular-nums text-app-text">
            {amount}
          </span>
        </span>
        <span className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`badge ${badge.className}`}>{badge.label}</span>
          <span className="text-[11px] font-medium text-app-sub">{meta}</span>
        </span>
      </span>
    </div>
  </button>
);

const TransactionSection = ({ title, subtitle, emptyText, children, count }) => (
  <div className="rounded-xl border border-line bg-surface-soft p-4">
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-extrabold text-app-text">{title}</h3>
        <p className="mt-1 text-xs text-app-sub">{subtitle}</p>
      </div>
      <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-app-sub">
        {count}
      </span>
    </div>
    <div className="space-y-2">
      {count ? (
        children
      ) : (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface px-4 text-center">
          <MdInbox size={22} className="mb-2 text-app-muted" />
          <p className="text-xs font-medium text-app-sub">{emptyText}</p>
        </div>
      )}
    </div>
  </div>
);

const PartyTransactionTab = ({
  loading,
  error,
  orders = [],
  payments = [],
  orderTitle,
  paymentTitle,
  orderSubtitle,
  paymentSubtitle,
  emptyOrderText,
  emptyPaymentText,
  onOrderClick,
  onPaymentClick,
}) => {
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((key) => (
          <div key={key} className="rounded-xl border border-line bg-surface-soft p-4">
            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-surface" />
            <div className="space-y-2">
              {[0, 1, 2].map((row) => (
                <div key={row} className="h-20 animate-pulse rounded-lg bg-surface" />
              ))}
            </div>
          </div>
        ))}
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
    <div className="grid gap-4 lg:grid-cols-2">
      <TransactionSection
        title={orderTitle}
        subtitle={orderSubtitle}
        emptyText={emptyOrderText}
        count={orders.length}
      >
        {orders.map((order) => {
          const percent = paidPercent(order);
          return (
            <TransactionCard
              key={order.orderId}
              icon={<MdShoppingCart size={17} />}
              title={order.orderPlatformRef || order.orderNumber || `Order #${order.orderId}`}
              date={fmtDate(order.orderDate)}
              amount={fmtMoney(order.totalAmount)}
              badge={{
                label: order.isViewed ? "Viewed" : "New",
                className: order.isViewed ? "badge-blue" : "badge-orange",
              }}
              meta={`${fmtMoney(order.paidAmount)} paid (${percent}%)`}
              onClick={() => onOrderClick(order)}
            />
          );
        })}
      </TransactionSection>

      <TransactionSection
        title={paymentTitle}
        subtitle={paymentSubtitle}
        emptyText={emptyPaymentText}
        count={payments.length}
      >
        {payments.map((payment) => (
          <TransactionCard
            key={payment.paymentId}
            icon={<MdPayments size={17} />}
            title={payment.paymentPlatformRef || `Payment #${payment.paymentId}`}
            date={fmtDate(payment.paymentDate)}
            amount={fmtMoney(payment.amount)}
            badge={{
              label: payment.isViewed ? "Viewed" : "New",
              className: payment.isViewed ? "badge-blue" : "badge-orange",
            }}
            meta="Payment transaction"
            onClick={() => onPaymentClick(payment)}
          />
        ))}
      </TransactionSection>
    </div>
  );
};

export default PartyTransactionTab;
