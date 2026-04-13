import { useNavigate } from "react-router-dom";
import { FiLogOut, FiSearch, FiBell, FiSettings } from "react-icons/fi";
import { MdKeyboardArrowDown, MdAdd } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useCallback } from "react";
import CompanyDrawer from "../../features/companyDrawer/CompanyDrawer";
import NotificationsDrawer from "../../features/notifications/components/NotificationsDrawer";
import { coreApi } from "../services/coreApi";

const Toolbar = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("");
  const [initials, setInitials] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [userId, setUserId] = useState("");
  const [openCompanyPanel, setOpenCompanyPanel] = useState(false);
  const [openNotificationsPanel, setOpenNotificationsPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async (compId) => {
    if (!compId) return;
    try {
      const res = await coreApi.getUnreadNotificationCount(compId);
      setUnreadCount(res?.data?.responseData?.unreadCount || 0);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      if (decode.defaultComp?.length) {
        setCompanyName(decode.defaultComp[1] || "");
        setCompanyId(decode.defaultComp[0] || "");
      }
      setUserId(decode.userId || decode.userID || decode.sub || decode.id || "");
      const name = decode.name || decode.sub || "";
      setUserName(name);
      const parts = name.trim().split(" ");
      setInitials(
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : name.slice(0, 2).toUpperCase()
      );
    }
  }, []);

  useEffect(() => {
    if (!companyId) return;

    fetchUnreadCount(companyId);

    const onFocus = () => fetchUnreadCount(companyId);
    const onNotificationsUpdated = (event) => {
      const updatedCompanyId = event?.detail?.companyId;
      if (updatedCompanyId && String(updatedCompanyId) !== String(companyId)) return;
      fetchUnreadCount(companyId);
    };

    const intervalId = setInterval(() => fetchUnreadCount(companyId), 60000);

    window.addEventListener("focus", onFocus);
    window.addEventListener("notifications:updated", onNotificationsUpdated);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("notifications:updated", onNotificationsUpdated);
    };
  }, [companyId, fetchUnreadCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/cf/auth/login");
  };

  const handleSettings = () => {
    if (userId) {
      navigate(`/cf/user/${userId}/settings`);
      return;
    }
    navigate("/cf/company/list");
  };

  return (
    <>
      <header
        className="h-full flex items-center gap-3 px-4"
        style={{ background: "var(--surface-bg)" }}
      >
        {/* Search */}
        <div className="flex-1 max-w-xs relative">
          <FiSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg outline-none transition-all"
            style={{
              background: "var(--surface-soft)",
              border: "1px solid var(--line)",
              color: "var(--text-main)",
              fontFamily: "Manrope, sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 0 3px rgba(58,155,90,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--line)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="flex-1" />

        {/* Upgrade pill */}
        <div
          className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }}
        >
          <span>You are on Free Plan</span>
          <button
            className="font-bold text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#fb923c", color: "#fff" }}
          >
            Upgrade
          </button>
        </div>

        <div className="w-px h-5 shrink-0" style={{ background: "var(--line)" }} />

        {/* Company selector */}
        <button
          onClick={() => {
            setOpenNotificationsPanel(false);
            setOpenCompanyPanel(true);
          }}
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "var(--text-main)", background: "var(--surface-soft)", border: "1px solid var(--line)" }}
        >
          <span className="max-w-[120px] truncate">{companyName || "Select Company"}</span>
          <MdKeyboardArrowDown size={16} style={{ color: "var(--text-sub)" }} />
        </button>

        <div className="w-px h-5 shrink-0" style={{ background: "var(--line)" }} />

        {/* Add button */}
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "var(--accent)", color: "#fff" }}
          title="New"
        >
          <MdAdd size={18} />
        </button>

        {/* Bell */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--text-sub)" }}
          title="Notifications"
          onClick={() => {
            setOpenCompanyPanel(false);
            setOpenNotificationsPanel((prev) => !prev);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <FiBell size={17} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: "var(--red)", color: "#fff" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--text-sub)" }}
          title="Settings"
          onClick={handleSettings}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <FiSettings size={17} />
        </button>

        {/* Avatar + logout */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--text-sub)" }}
            title="Logout"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </header>

      <CompanyDrawer
        open={openCompanyPanel}
        onClose={() => setOpenCompanyPanel(false)}
      />
      <NotificationsDrawer
        open={openNotificationsPanel}
        onClose={() => setOpenNotificationsPanel(false)}
      />
    </>
  );
};

export default Toolbar;
