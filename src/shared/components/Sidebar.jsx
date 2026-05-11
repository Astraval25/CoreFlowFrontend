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
  MdPeople,
  MdWork,
  MdEventNote,
  MdAccountBalance,
  MdBuild,
  MdEventAvailable,
  MdReceiptLong,
  MdSettings,
  MdAccountBalanceWallet,
} from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ minimized = false, onToggleMinimize = () => { } }) => {
  const [openGroups, setOpenGroups] = useState({
    manage: false,
    sales: false,
    purchase: false,
    payments: false,
    employees: false,
    setup: false,
  });
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
  const reportPath = withCompany("report");
  const marketplacePath = "/cf/marketplace/companies";

  const manageChildren = [
    { label: "Customers", to: withCompany("customers"), icon: <MdManageAccounts size={16} />, match: "/customers" },
    { label: "Items", to: withCompany("items"), icon: <MdInventory2 size={16} />, match: "/items" },
    { label: "Vendors", to: withCompany("vendors"), icon: <MdStorefront size={16} />, match: "/vendors" },
  ];

  const salesChildren = [
    { label: "Quotes", to: `${withCompany("sales")}?tab=quotes`, icon: <MdPointOfSale size={16} />, match: "sales-tab=quotes" },
    { label: "Sales Order", to: `${withCompany("sales")}?tab=salesOrder`, icon: <MdPointOfSale size={16} />, match: "sales-tab=salesOrder" },
    { label: "Invoice", to: `${withCompany("sales")}?tab=invoice`, icon: <MdPointOfSale size={16} />, match: "sales-tab=invoice" },
  ];

  const purchaseChildren = [
    { label: "Quotes", to: `${withCompany("purchase/list")}?tab=quotes`, icon: <FaShoppingCart size={14} />, match: "purchase-tab=quotes" },
    { label: "Purchase Order", to: `${withCompany("purchase/list")}?tab=purchaseOrder`, icon: <FaShoppingCart size={14} />, match: "purchase-tab=purchaseOrder" },
    { label: "Bill", to: `${withCompany("purchase/list")}?tab=bill`, icon: <FaShoppingCart size={14} />, match: "purchase-tab=bill" },
  ];

  const paymentsChildren = [
    { label: "Expenses", to: withCompany("expenses/list"), icon: <MdReceiptLong size={16} />, match: "/expenses" },
    { label: "Payment Made", to: withCompany("payment-made/list"), icon: <MdOutlinePayments size={16} />, match: "/payment-made" },
    { label: "Payment Received", to: withCompany("payment-received/list"), icon: <MdPayments size={16} />, match: "/payment-received" },

  ];

  const employeeChildren = [
    { label: "Employees", to: withCompany("employees"), icon: <MdPeople size={16} />, match: "/employees" },
    { label: "Work Definitions", to: withCompany("work-definitions"), icon: <MdBuild size={16} />, match: "/work-definitions" },
    { label: "Work Logs", to: withCompany("work-logs"), icon: <MdWork size={16} />, match: "/work-logs" },
    { label: "Leave Logs", to: withCompany("leave-logs"), icon: <MdEventAvailable size={16} />, match: "/leave-logs" },
    { label: "Salary", to: withCompany("salary"), icon: <MdAccountBalance size={16} />, match: "/salary" },
  ];

  const setupChildren = [
    { label: "Expense Account", to: withCompany("setup/expense-accounts"), icon: <MdAccountBalanceWallet size={16} />, match: "/setup/expense-accounts" },
  ];

  const currentLocation = `${location.pathname}${location.search}`;
  const matchesItem = (match) => {
    // "sales-tab=quotes" → must be on /sales path AND have ?tab=quotes
    const salesTabMatch = match.match(/^sales-tab=(.+)$/);
    if (salesTabMatch) return location.pathname.includes("/sales") && location.search.includes(`tab=${salesTabMatch[1]}`);
    const purchaseTabMatch = match.match(/^purchase-tab=(.+)$/);
    if (purchaseTabMatch) return location.pathname.includes("/purchase") && location.search.includes(`tab=${purchaseTabMatch[1]}`);
    return currentLocation.includes(match);
  };

  const isManageActive = manageChildren.some((item) => matchesItem(item.match));
  const isSalesActive = salesChildren.some((item) => matchesItem(item.match)) || (location.pathname.includes("/sales") && !location.search.includes("tab="));
  const isPurchaseActive = purchaseChildren.some((item) => matchesItem(item.match)) || (location.pathname.includes("/purchase") && !location.search.includes("tab="));
  const isPaymentsActive = paymentsChildren.some((item) => matchesItem(item.match));
  const isEmployeesActive = employeeChildren.some((item) => matchesItem(item.match));
  const isSetupActive = setupChildren.some((item) => matchesItem(item.match));

  useEffect(() => {
    if (minimized) return;
    const active = isManageActive ? "manage" : isSalesActive ? "sales" : isPurchaseActive ? "purchase" : isPaymentsActive ? "payments" : isEmployeesActive ? "employees" : isSetupActive ? "setup" : null;
    if (active) setOpenGroups((prev) => {
      const next = {};
      for (const k in prev) next[k] = k === active;
      return next;
    });
  }, [minimized, isManageActive, isSalesActive, isPurchaseActive, isPaymentsActive, isEmployeesActive, isSetupActive]);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => {
      const isOpening = !prev[key];
      const next = {};
      for (const k in prev) next[k] = isOpening ? k === key : (k === key ? false : prev[k]);
      return next;
    });
  };

  const compactItems = [
    { label: "Home", to: homePath, icon: <MdDashboard size={19} /> },
    { label: "Marketplace", to: marketplacePath, icon: <MdStorefront size={17} /> },
    ...manageChildren,
    ...salesChildren,
    ...purchaseChildren,
    ...paymentsChildren,
    ...employeeChildren,
    ...setupChildren,
    { label: "Report", to: reportPath, icon: <MdAssessment size={18} /> },
  ];

  const expandedItemClass = ({ isActive }) =>
    `group flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${isActive
      ? "font-semibold shadow-sm rounded-md"
      : "font-medium hover:bg-brand-soft rounded-xl"
    }`;

  const compactItemClass = ({ isActive }) =>
    `group relative flex items-center justify-center w-11 h-11 mx-auto transition-colors ${isActive
      ? "shadow-sm rounded-md"
      : "hover:bg-brand-soft rounded-xl"
    }`;

  const groupButtonClass = (active) =>
    `w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-medium transition-colors ${active
      ? "hover:bg-brand-soft"
      : "hover:bg-brand-soft"
    }`;

  const nestedItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-2.5 py-2 text-[13px] transition-colors ${isActive
      ? "font-semibold rounded-sm"
      : "font-medium hover:bg-brand-soft rounded-lg"
    }`;

  const renderNestedLinks = (items) => (
    <div className="ml-5 pl-3 py-1 space-y-1">
      {items.map((item) => {
        const active = matchesItem(item.match);
        return (
          <NavLink
            key={`${item.label}-${item.to}`}
            to={item.to}
            className={() => nestedItemClass({ isActive: active })}
            style={{
              background: active ? "var(--accent-soft)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-heading)",
            }}
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <aside
      className="h-full flex flex-col thin-scroll overflow-y-auto bg-app"
    >
      <div
        className={`flex items-center h-16 shrink-0 border-b border-gray-200 bg-white ${minimized ? "justify-center px-2" : "gap-2.5 px-4"}`}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-brand"
        >
          <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
        </div>
        {!minimized && (
          <div>
            <p className="font-bold text-sm leading-tight text-app-text">
              CoreFlow
            </p>
            <p className="text-[10px] leading-tight text-app-sub">
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
                style={({ isActive }) => ({
                  background: isActive ? "var(--accent-soft)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--text-heading)",
                })}
              >
                {item.icon}
              </NavLink>
            ))}
          </>
        ) : (
          <>
            <NavLink
              to={homePath}
              className={expandedItemClass}
              style={({ isActive }) => ({
                background: isActive ? "var(--accent-soft)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-heading)",
              })}
            >
              <MdDashboard size={17} />
              <span>Home</span>
            </NavLink>

            <div className="rounded-xl p-1 bg-sidebar-group">
              <button
                onClick={() => toggleGroup("manage")}
                className={groupButtonClass(isManageActive)}
                style={{
                  background: "transparent",
                  color: "var(--text-heading)",
                }}
              >
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
                className={`overflow-hidden transition-all duration-200 ${openGroups.manage ? "max-h-64 mt-1" : "max-h-0"
                  }`}
              >
                {renderNestedLinks(manageChildren)}
              </div>
            </div>

            <div className="rounded-xl p-1 bg-sidebar-group">
              <button
                onClick={() => toggleGroup("sales")}
                className={groupButtonClass(isSalesActive)}
                style={{
                  background: "transparent",
                  color: "var(--text-heading)",
                }}
              >
                <span className="flex items-center gap-2.5">
                  <MdPointOfSale size={17} />
                  Sales
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${openGroups.sales ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${openGroups.sales ? "max-h-72 mt-1" : "max-h-0"
                  }`}
              >
                {renderNestedLinks(salesChildren)}
              </div>
            </div>

            <div className="rounded-xl p-1 bg-sidebar-group">
              <button
                onClick={() => toggleGroup("purchase")}
                className={groupButtonClass(isPurchaseActive)}
                style={{
                  background: "transparent",
                  color: "var(--text-heading)",
                }}
              >
                <span className="flex items-center gap-2.5">
                  <FaShoppingCart size={15} />
                  Purchase
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${openGroups.purchase ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${openGroups.purchase ? "max-h-72 mt-1" : "max-h-0"
                  }`}
              >
                {renderNestedLinks(purchaseChildren)}
              </div>
            </div>

            <div className="rounded-xl p-1 bg-sidebar-group">
              <button
                onClick={() => toggleGroup("payments")}
                className={groupButtonClass(isPaymentsActive)}
                style={{
                  background: "transparent",
                  color: "var(--text-heading)",
                }}
              >
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
                className={`overflow-hidden transition-all duration-200 ${openGroups.payments ? "max-h-40 mt-1" : "max-h-0"
                  }`}
              >
                {renderNestedLinks(paymentsChildren)}
              </div>
            </div>

            <div className="rounded-xl p-1 bg-sidebar-group">
              <button
                onClick={() => toggleGroup("employees")}
                className={groupButtonClass(isEmployeesActive)}
                style={{
                  background: "transparent",
                  color: "var(--text-heading)",
                }}
              >
                <span className="flex items-center gap-2.5">
                  <MdPeople size={17} />
                  Employees
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${openGroups.employees ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${openGroups.employees ? "max-h-80 mt-1" : "max-h-0"
                  }`}
              >
                {renderNestedLinks(employeeChildren)}
              </div>
            </div>

            <NavLink
              to={reportPath}
              className={expandedItemClass}
              style={({ isActive }) => ({
                background: isActive ? "var(--accent-soft)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-heading)",
              })}
            >
              <MdAssessment size={17} />
              <span>Report</span>
            </NavLink>


            <NavLink
              to={marketplacePath}
              className={expandedItemClass}
              style={({ isActive }) => ({
                background: isActive ? "var(--accent-soft)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-heading)",
              })}
            >
              <MdStorefront size={17} />
              <span>Marketplace</span>
            </NavLink>


            {/*Setup */}
            {/* <div className="rounded-xl p-1 bg-sidebar-group">
              <button
                onClick={() => toggleGroup("setup")}
                className={groupButtonClass(isSetupActive)}
                style={{
                  background: "transparent",
                  color: "var(--text-heading)",
                }}
              >
                <span className="flex items-center gap-2.5">
                  <MdSettings size={17} />
                  Setup
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${openGroups.setup ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openGroups.setup ? "max-h-32 mt-1" : "max-h-0"
                }`}
              >
                {renderNestedLinks(setupChildren)}
              </div>
            </div> */}
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
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors hover:bg-brand-soft text-app-text"
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
