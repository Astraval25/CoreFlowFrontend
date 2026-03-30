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

const NAV = [
  {
    type: "link",
    to: "/admin/dashboard",
    icon: <MdDashboard size={17} />,
    label: "Home",
  },
  {
    type: "group",
    icon: <MdManageAccounts size={17} />,
    label: "Manage",
    key: "manage",
    paths: ["/admin/customers", "/admin/items", "/admin/vendors"],
    children: [
      { to: "/admin/customers", label: "Customers" },
      { to: "/admin/items",     label: "Items" },
      { to: "/admin/vendors",   label: "Vendors" },
    ],
  },
  {
    type: "link",
    to: "/admin/sales",
    icon: <MdPayments size={17} />,
    label: "Sales",
  },
  {
    type: "link",
    to: "/admin/purchase",
    icon: <FaShoppingCart size={15} />,
    label: "Purchases",
  },
  {
    type: "link",
    to: "/admin/banking",
    icon: <MdAccountBalance size={17} />,
    label: "Banking",
    disabled: true,
  },
  {
    type: "link",
    to: "/admin/reports",
    icon: <MdAssessment size={17} />,
    label: "Reports",
    disabled: true,
  },
  {
    type: "link",
    to: "/admin/documents",
    icon: <MdDescription size={17} />,
    label: "Documents",
    disabled: true,
  },
];

const Sidebar = () => {
  const [openGroups, setOpenGroups] = useState({});
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    NAV.forEach((item) => {
      if (item.type === "group") {
        if (item.paths.some((p) => path.startsWith(p))) {
          setOpenGroups((prev) => ({ ...prev, [item.key]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggle = (key) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeLink =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-white bg-[var(--sidebar-active-bg)] text-sm";
  const baseLink =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] text-sm transition-colors";
  const disabledLink =
    "flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-[var(--sidebar-text)] opacity-40 cursor-not-allowed text-sm";

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
        {NAV.map((item) => {
          if (item.type === "link") {
            if (item.disabled) {
              return (
                <div key={item.to} className={disabledLink}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? activeLink : baseLink)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          }

          if (item.type === "group") {
            const isOpen = !!openGroups[item.key];
            const isGroupActive = item.paths.some((p) =>
              location.pathname.startsWith(p)
            );

            return (
              <div key={item.key}>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isGroupActive
                      ? "text-[var(--sidebar-text-bright)] bg-[var(--sidebar-hover)]"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <MdKeyboardArrowDown
                    size={18}
                    className={`transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-52 mt-0.5" : "max-h-0"
                  }`}
                >
                  <div className="ml-4 pl-3 py-0.5 space-y-0.5" style={{ borderLeft: "1px solid var(--sidebar-border)" }}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          isActive
                            ? "block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--sidebar-active-bg)]"
                            : "block px-3 py-2 rounded-lg text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-bright)] transition-colors"
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </nav>

      {/* Bottom label */}
      <div className="px-4 py-3 text-[10px]" style={{ color: "var(--sidebar-text)", borderTop: "1px solid var(--sidebar-border)" }}>
        © 2026 CoreFlow
      </div>
    </aside>
  );
};

export default Sidebar;
