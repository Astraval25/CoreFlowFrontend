import { useNavigate } from "react-router-dom";
import { FiLogOut, FiSearch, FiBell, FiSettings } from "react-icons/fi";
import {
  MdKeyboardArrowDown,
  MdAdd,
  MdChevronRight,
  MdPointOfSale,
  MdShoppingCart,
  MdPayments,
  MdOutlinePayments,
  MdPersonAddAlt1,
  MdStorefront,
  MdInventory2,
  MdFlashOn,
} from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useCallback, useRef } from "react";
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
  const [openCreateShortcutMenu, setOpenCreateShortcutMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const createMenuRef = useRef(null);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!createMenuRef.current?.contains(event.target)) {
        setOpenCreateShortcutMenu(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenCreateShortcutMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  const createShortcuts = [
    {
      label: "Sales Order",
      path: "sales/create",
      icon: MdPointOfSale,
      hint: "Create a new sales order",
    },
    {
      label: "Purchase Order",
      path: "purchase/create",
      icon: MdShoppingCart,
      hint: "Create a new purchase order",
    },
    {
      label: "Payment Receive",
      path: "payment-received/create",
      icon: MdPayments,
      hint: "Record incoming payment",
    },
    {
      label: "Payment Made",
      path: "payment-made/create",
      icon: MdOutlinePayments,
      hint: "Record outgoing payment",
    },
    {
      label: "Customer",
      path: "customers/create",
      icon: MdPersonAddAlt1,
      hint: "Add a new customer",
    },
    {
      label: "Vendor",
      path: "vendors/create",
      icon: MdStorefront,
      hint: "Add a new vendor",
    },
    {
      label: "Item",
      path: "items/create",
      icon: MdInventory2,
      hint: "Create a product or service",
    },
  ];

  const handleCreateShortcutClick = (path) => {
    setOpenCreateShortcutMenu(false);
    setOpenNotificationsPanel(false);
    setOpenCompanyPanel(false);
    if (!companyId) {
      navigate("/cf/company/list");
      return;
    }
    navigate(`/cf/company/${companyId}/${path}`);
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
              e.target.style.boxShadow = "0 0 0 3px var(--accent-tint)";
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
          style={{ background: "var(--orange-bg)", color: "var(--orange-text)", border: "1px solid var(--orange-border)" }}
        >
          <span>You are on Free Plan</span>
          <button
            className="font-bold text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--orange)", color: "var(--surface-bg)" }}
          >
            Upgrade
          </button>
        </div>

        <div className="w-px h-5 shrink-0" style={{ background: "var(--line)" }} />

        {/* Company selector */}
        <button
          onClick={() => {
            setOpenCreateShortcutMenu(false);
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
        <div className="relative" ref={createMenuRef}>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "var(--accent)",
              color: "var(--surface-bg)",
              boxShadow: "0 6px 14px var(--accent-shadow)",
            }}
            title="Create shortcut"
            onClick={() => {
              setOpenNotificationsPanel(false);
              setOpenCompanyPanel(false);
              setOpenCreateShortcutMenu((prev) => !prev);
            }}
          >
            <MdAdd size={18} />
          </button>

          {openCreateShortcutMenu && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl border z-[60] overflow-hidden"
              style={{
                borderColor: "var(--line)",
                background: "var(--surface-bg)",
                boxShadow: "0 18px 36px var(--shadow-floating)",
              }}
            >
              
              <div className="p-1.5 space-y-0.5">
                {createShortcuts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      className="w-full text-left px-2 py-2 rounded-lg flex items-center gap-2.5 transition-colors hover:bg-[var(--surface-soft)]"
                      style={{ color: "var(--text-main)" }}
                      onClick={() => handleCreateShortcutClick(item.path)}
                    >
                      <span
                        className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center"
                        style={{
                          background: "var(--accent-tint)",
                          color: "var(--accent)",
                        }}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold">{item.label}</span>
                        <span className="block text-[10px] text-[var(--text-muted)]">{item.hint}</span>
                      </span>
                      <MdChevronRight size={15} style={{ color: "var(--text-muted)" }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bell */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--text-sub)" }}
          title="Notifications"
          onClick={() => {
            setOpenCreateShortcutMenu(false);
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
              style={{ background: "var(--red)", color: "var(--surface-bg)" }}
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
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--red-soft)")}
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
