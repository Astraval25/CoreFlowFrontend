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
      path.startsWith("/customers") ||
      path.startsWith("/items") ||
      path.startsWith("/vendors")
    ) {
      setOpenGroups((prev) => ({ ...prev, manage: true }));
    }
  }, [location.pathname]);

  const toggle = (key) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const active =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]";
  const base =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors";
  const disabled =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] opacity-40 cursor-not-allowed";

  const cid = companyId;

  return (
    <aside
      className="h-full flex flex-col thin-scroll overflow-y-auto"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 h-16 px-4 shrink-0"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
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

        <NavLink to="/dashboard" className={({ isActive }) => isActive ? active : base}>
          <MdDashboard size={17} />
          <span>Home</span>
        </NavLink>

        {/* Manage group */}
        <div>
          <button
            onClick={() => toggle("manage")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith("/customers") ||
              location.pathname.startsWith("/items") ||
              location.pathname.startsWith("/vendors")
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
              style={{ borderLeft: "1px solid var(--sidebar-border)" }}
            >
              {cid && (
                <>
                  <NavLink
                    to={`/customers/${cid}`}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                        : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                    }
                  >
                    Customers
                  </NavLink>
                  <NavLink
                    to={`/items/${cid}`}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                        : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                    }
                  >
                    Items
                  </NavLink>
                  <NavLink
                    to={`/vendors/${cid}`}
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

        <NavLink to="/sales" className={({ isActive }) => isActive ? active : base}>
          <MdPayments size={17} />
          <span>Sales</span>
        </NavLink>

        <NavLink to="/purchase" className={({ isActive }) => isActive ? active : base}>
          <FaShoppingCart size={15} />
          <span>Purchases</span>
        </NavLink>

        <div className={disabled}><MdAccountBalance size={17} /><span>Banking</span></div>
        <div className={disabled}><MdAssessment size={17} /><span>Reports</span></div>
        <div className={disabled}><MdDescription size={17} /><span>Documents</span></div>
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
