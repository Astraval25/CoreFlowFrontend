import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdCircle, MdDoneAll, MdInbox, MdChevronLeft, MdChevronRight } from "react-icons/md";
import useNotifications from "../hooks/useNotifications";

const typeClasses = {
  LEAVE_LOG_CREATED: "text-warning",
  WORK_LOG_CREATED: "text-info",
  ORDER_CREATED: "text-brand",
  PAYMENT_RECEIVED: "text-brand",
  PAYMENT_SENT: "text-danger",
};

const formatDate = (dt) => {
  if (!dt) return "";
  const d = new Date(dt);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    page,
    hasNext,
    hasPrevious,
    totalPages,
    markRead,
    markAllRead,
    goNext,
    goPrev,
  } = useNotifications();

  const navigate = useNavigate();

  const handleClick = (n) => {
    if (!n.isRead) markRead(n.notificationId);
    if (n.actionUrl) navigate(n.actionUrl);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold text-app-text">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-danger-soft text-danger-text">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-xs flex items-center gap-1">
            <MdDoneAll size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xs text-app-muted">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-2">
              <MdInbox size={28} className="text-app-muted" />
              <p className="text-xs text-app-muted">No notifications</p>
            </div>
          </div>
        ) : (
          <div>
            {notifications.map((n) => (
              <div
                key={n.notificationId}
                onClick={() => handleClick(n)}
                className="flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors"
                style={{
                  borderBottom: "1px solid var(--line)",
                  background: n.isRead ? "transparent" : "var(--surface-soft)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = n.isRead ? "transparent" : "var(--surface-soft)")}
              >
                {/* Unread indicator */}
                <div className="pt-1 shrink-0">
                  {n.isRead ? (
                    <MdCheckCircle size={10} className="text-app-muted" />
                  ) : (
                    <MdCircle size={10} className={typeClasses[n.type] || "text-brand"} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-app-text">
                      {n.title}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-soft ${typeClasses[n.type] || "text-app-sub"}`}
                    >
                      {(n.type || "").replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs mb-1 text-app-sub">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-app-muted">
                      {formatDate(n.createdDt)}
                    </span>
                    {n.actionLabel && (
                      <span className="text-[10px] font-semibold text-brand">
                        {n.actionLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mark read button */}
                {!n.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(n.notificationId);
                    }}
                    className="shrink-0 text-[10px] font-medium px-2 py-1 rounded transition-colors text-brand"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-line bg-surface-soft">
            <button
              onClick={goPrev}
              disabled={!hasPrevious}
              className="flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-40 text-app-sub"
            >
              <MdChevronLeft size={16} /> Previous
            </button>
            <span className="text-[11px] font-medium text-app-muted">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={!hasNext}
              className="flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-40 text-app-sub"
            >
              Next <MdChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
