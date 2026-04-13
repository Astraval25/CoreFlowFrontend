import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";
import {
  MdDashboard,
  MdKeyboardArrowDown,
  MdManageAccounts,
  MdPayments,
  MdAssessment,
  MdAccountBalance,
  MdDescription,
} from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const [openGroups, setOpenGroups] = useState({});
  const [companyId, setCompanyId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);
        setCompanyId(decode.defaultComp?.[0] ?? "");
      } catch {
        // ignore
      }
    }
  }, []);

  // Auto-open the group when a child path is active
  useEffect(() => {
    const path = location.pathname;
    if (
      path.includes("/customers") ||
      path.includes("/items") ||
      path.includes("/vendors")
    ) {
      setOpenGroups((prev) => ({ ...prev, manage: true }));
    }
    if (
      path.includes("/payment-made") ||
      path.includes("/payment-received")
    ) {
      setOpenGroups((prev) => ({ ...prev, payments: true }));
    }
  }, [location.pathname]);

  const toggle = (key) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const active =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]";
  const base =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors";

  const cid = companyId;
  const companyRoot = cid ? `/cf/company/${cid}` : "/cf/company";
  const homePath = cid ? `${companyRoot}/dashboard` : "/cf/company/list";
  const salesPath = cid ? `${companyRoot}/sales` : "/cf/company/list";
  const purchasePath = cid ? `${companyRoot}/purchase/list` : "/cf/company/list";

  return (
    <aside
      className="h-full flex flex-col thin-scroll overflow-y-auto"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 h-16 px-4 shrink-0"
        style={{ borderBottom: "0.4px solid var(--sidebar-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--sidebar-logo-bg)" }}
        >
          <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight" style={{ color: "var(--sidebar-text-bright)" }}>
            CoreFlow
          </p>
          <p className="text-[10px] leading-tight" style={{ color: "var(--sidebar-text)" }}>
            Business Suite
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">

        <NavLink to={homePath} className={({ isActive }) => isActive ? active : base}>
          <MdDashboard size={17} />
          <span>Home</span>
        </NavLink>

        {/* Manage group */}
        <div>
          <button
            onClick={() => toggle("manage")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.includes("/customers") ||
              location.pathname.includes("/items") ||
              location.pathname.includes("/vendors")
                ? "text-[var(--sidebar-text-bright)] bg-[var(--sidebar-hover)]"
                : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MdManageAccounts size={17} />
              Manage
            </span>
            <MdKeyboardArrowDown
              size={18}
              className={`transition-transform shrink-0 ${openGroups.manage ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ${
              openGroups.manage ? "max-h-40 mt-0.5" : "max-h-0"
            }`}
          >
            <div
              className="ml-4 pl-3 py-0.5 space-y-0.5"
            >
              {cid && (
                <>
                  <NavLink
                    to={`${companyRoot}/customers`}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                        : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                    }
                  >
                    Customers
                  </NavLink>
                  <NavLink
                    to={`${companyRoot}/items`}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                        : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                    }
                  >
                    Items
                  </NavLink>
                  <NavLink
                    to={`${companyRoot}/vendors`}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                        : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                    }
                  >
                    Vendors
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>

        <NavLink to={salesPath} className={({ isActive }) => isActive ? active : base}>
          <MdPayments size={17} />
          <span>Sales</span>
        </NavLink>

        <NavLink to={purchasePath} className={({ isActive }) => isActive ? active : base}>
          <FaShoppingCart size={15} />
          <span>Purchases</span>
        </NavLink>

        {/* Payments group */}
        <div>
          <button
            onClick={() => toggle("payments")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.includes("/payment-made") ||
              location.pathname.includes("/payment-received")
                ? "text-[var(--sidebar-text-bright)] bg-[var(--sidebar-hover)]"
                : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MdAccountBalance size={17} />
              Payments
            </span>
            <MdKeyboardArrowDown
              size={18}
              className={`transition-transform shrink-0 ${openGroups.payments ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ${
              openGroups.payments ? "max-h-40 mt-0.5" : "max-h-0"
            }`}
          >
            <div className="ml-4 pl-3 py-0.5 space-y-0.5">
              {cid && (
                <>
                  <NavLink
                    to={`${companyRoot}/payment-made/list`}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                        : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                    }
                  >
                    Payment Made
                  </NavLink>
                  <NavLink
                    to={`${companyRoot}/payment-received/list`}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                        : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                    }
                  >
                    Payment Received
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>

      </nav>

      <div
        className="px-4 py-3 text-[10px]"
        style={{ color: "var(--sidebar-text)", borderTop: "1px solid var(--sidebar-border)" }}
      >
        © 2026 CoreFlow
      </div>
    </aside>
  );
};

export default Sidebar;
