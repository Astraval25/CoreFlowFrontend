import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdCircle,
  MdClose,
  MdDoneAll,
  MdInbox,
} from "react-icons/md";
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

const NotificationsDrawer = ({ open, onClose }) => {
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
  } = useNotifications({ enabled: open });
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await markRead(n.notificationId);
    }
    if (n.actionUrl) {
      onClose();
      navigate(n.actionUrl);
    }
  };

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-danger-soft text-danger-text">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-medium px-2 py-1 rounded hover:bg-gray-200 text-brand flex items-center gap-1"
              >
                <MdDoneAll size={13} />
                Mark all
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-200">
              <MdClose size={20} />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-56px)] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xs text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <MdInbox size={28} className="text-gray-400" />
                  <p className="text-xs text-gray-500">No notifications</p>
                </div>
              </div>
            ) : (
              <div>
                {notifications.map((n) => (
                  <div
                    key={n.notificationId}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 hover:bg-surface-soft ${n.isRead ? "bg-surface" : "bg-surface-soft"}`}
                  >
                    <div className="pt-1 shrink-0">
                      {n.isRead ? (
                        <MdCheckCircle size={10} className="text-app-muted" />
                      ) : (
                        <MdCircle size={10} className={typeClasses[n.type] || "text-brand"} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-app-text">{n.title}</span>
                      </div>
                      <p className="text-xs mb-1 text-app-sub">{n.message}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-app-muted">{formatDate(n.createdDt)}</span>
                        {n.actionLabel && (
                          <span className="text-[10px] font-semibold text-brand">{n.actionLabel}</span>
                        )}
                      </div>
                    </div>

                    {!n.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(n.notificationId);
                        }}
                        className="shrink-0 text-[10px] font-medium px-2 py-1 rounded transition-colors text-brand hover:bg-gray-100"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={goPrev}
                disabled={!hasPrevious}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:opacity-40"
              >
                <MdChevronLeft size={16} /> Previous
              </button>
              <span className="text-[11px] font-medium text-gray-500">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={goNext}
                disabled={!hasNext}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:opacity-40"
              >
                Next <MdChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsDrawer;
