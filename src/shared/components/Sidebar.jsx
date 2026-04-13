import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";
import {
  MdDashboard,
  MdKeyboardArrowDown,
  MdChevronLeft,
  MdChevronRight,
  MdManageAccounts,
  MdPointOfSale,
  MdInventory2,
  MdStorefront,
  MdAssessment,
  MdOutlinePayments,
  MdPayments,
} from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ minimized = false, onToggleMinimize = () => {} }) => {
  const [openGroups, setOpenGroups] = useState({ manage: false, payments: false });
  const [companyId, setCompanyId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decode = jwtDecode(token);
      setCompanyId(decode.defaultComp?.[0] ?? "");
    } catch {
      // ignore
    }
  }, []);

  const cid = companyId;
  const companyRoot = cid ? `/cf/company/${cid}` : "/cf/company";
  const fallbackPath = "/cf/company/list";
  const withCompany = (path) => (cid ? `${companyRoot}/${path}` : fallbackPath);

  const homePath = withCompany("dashboard");
  const salesPath = withCompany("sales");
  const purchasePath = withCompany("purchase/list");
  const reportPath = withCompany("report");

  const manageChildren = [
    { label: "Customers", to: withCompany("customers"), icon: <MdManageAccounts size={16} />, match: "/customers" },
    { label: "Items", to: withCompany("items"), icon: <MdInventory2 size={16} />, match: "/items" },
    { label: "Vendors", to: withCompany("vendors"), icon: <MdStorefront size={16} />, match: "/vendors" },
  ];

  const paymentChildren = [
    { label: "Payment Made", to: withCompany("payment-made/list"), icon: <MdOutlinePayments size={16} />, match: "/payment-made" },
    { label: "Payment Received", to: withCompany("payment-received/list"), icon: <MdPayments size={16} />, match: "/payment-received" },
  ];

  const isManageActive = manageChildren.some((item) => location.pathname.includes(item.match));
  const isPaymentsActive = paymentChildren.some((item) => location.pathname.includes(item.match));

  useEffect(() => {
    if (minimized) return;
    if (isManageActive) {
      setOpenGroups((prev) => ({ ...prev, manage: true }));
    }
    if (isPaymentsActive) {
      setOpenGroups((prev) => ({ ...prev, payments: true }));
    }
  }, [minimized, isManageActive, isPaymentsActive]);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const compactItems = [
    { label: "Home", to: homePath, icon: <MdDashboard size={19} /> },
    ...manageChildren,
    { label: "Sales", to: salesPath, icon: <MdPointOfSale size={18} /> },
    { label: "Purchases", to: purchasePath, icon: <FaShoppingCart size={16} /> },
    ...paymentChildren,
    { label: "Report", to: reportPath, icon: <MdAssessment size={18} /> },
  ];

  const expandedItemClass = ({ isActive }) =>
    `group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
      isActive
        ? "font-semibold text-white bg-[var(--sidebar-active-bg)] shadow-sm"
        : "font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)]"
    }`;

  const compactItemClass = ({ isActive }) =>
    `group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-colors ${
      isActive
        ? "text-white bg-[var(--sidebar-active-bg)] shadow-sm"
        : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)]"
    }`;

  const groupButtonClass = (active) =>
    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
      active
        ? "text-[var(--sidebar-text-bright)] bg-[var(--sidebar-hover)]"
        : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)]"
    }`;

  const nestedItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
      isActive
        ? "font-semibold text-white bg-[var(--sidebar-active-bg)]"
        : "font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)]"
    }`;

  const renderNestedLinks = (items) => (
    <div className="ml-5 pl-3 py-1 space-y-1">
      {items.map((item) => (
        <NavLink key={`${item.label}-${item.to}`} to={item.to} className={nestedItemClass}>
          <span className="shrink-0">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside
      className="h-full flex flex-col thin-scroll overflow-y-auto"
      style={{ background: "var(--sidebar-bg)" }}
    >
      <div
        className={`flex items-center h-16 shrink-0 ${minimized ? "justify-center px-2" : "gap-2.5 px-4"}`}
        style={{ borderBottom: "0.4px solid var(--sidebar-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--sidebar-logo-bg)" }}
        >
          <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
        </div>
        {!minimized && (
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: "var(--sidebar-text-bright)" }}>
              CoreFlow
            </p>
            <p className="text-[10px] leading-tight" style={{ color: "var(--sidebar-text)" }}>
              Business Suite
            </p>
          </div>
        )}
      </div>

      <nav className={`flex-1 py-4 ${minimized ? "px-1.5 space-y-1.5" : "px-3 space-y-1"}`}>
        {minimized ? (
          <>
            {compactItems.map((item) => (
              <NavLink
                key={`${item.label}-${item.to}`}
                to={item.to}
                title={item.label}
                className={compactItemClass}
              >
                {item.icon}
              </NavLink>
            ))}
          </>
        ) : (
          <>
            <NavLink to={homePath} className={expandedItemClass}>
              <MdDashboard size={17} />
              <span>Home</span>
            </NavLink>

            <div className="rounded-xl p-1" style={{ background: "rgba(255,255,255,0.02)" }}>
              <button onClick={() => toggleGroup("manage")} className={groupButtonClass(isManageActive)}>
                <span className="flex items-center gap-2.5">
                  <MdManageAccounts size={17} />
                  Manage
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${openGroups.manage ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openGroups.manage ? "max-h-64 mt-1" : "max-h-0"
                }`}
              >
                {renderNestedLinks(manageChildren)}
              </div>
            </div>

            <NavLink to={salesPath} className={expandedItemClass}>
              <MdPointOfSale size={17} />
              <span>Sales</span>
            </NavLink>

            <NavLink to={purchasePath} className={expandedItemClass}>
              <FaShoppingCart size={15} />
              <span>Purchases</span>
            </NavLink>

            <div className="rounded-xl p-1" style={{ background: "rgba(255,255,255,0.02)" }}>
              <button onClick={() => toggleGroup("payments")} className={groupButtonClass(isPaymentsActive)}>
                <span className="flex items-center gap-2.5">
                  <MdPayments size={17} />
                  Payments
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${openGroups.payments ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openGroups.payments ? "max-h-56 mt-1" : "max-h-0"
                }`}
              >
                {renderNestedLinks(paymentChildren)}
              </div>
            </div>

            <NavLink to={reportPath} className={expandedItemClass}>
              <MdAssessment size={17} />
              <span>Report</span>
            </NavLink>
          </>
        )}
      </nav>

      <div
        className={`py-3 text-[10px] ${minimized ? "px-2.5" : "px-4"}`}
        style={{
          color: "var(--sidebar-text)",
          borderTop: "1px solid var(--sidebar-border)",
        }}
      >
        <div className={`flex items-center ${minimized ? "justify-center" : "justify-between"} gap-2`}>
          {!minimized && <span>&copy; 2026 CoreFlow</span>}
          <button
            type="button"
            title={minimized ? "Expand menu" : "Minimize menu"}
            onClick={onToggleMinimize}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors hover:bg-[var(--sidebar-hover)]"
            style={{ color: "var(--sidebar-text-bright)" }}
          >
            {minimized ? <MdChevronRight size={15} /> : <MdChevronLeft size={15} />}
            {!minimized && <span className="text-[10px] font-semibold">Minimize</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
