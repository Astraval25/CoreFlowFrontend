import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";
import {
  MdDashboard,
  MdKeyboardArrowDown,
  MdManageAccounts,
  MdPayments,
} from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [openManage, setOpenManage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/customers") || path.includes("/admin/items") || path.includes("/admin/vendors")) {
      setOpenManage(true);
    }
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors
     ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-[#304130] hover:bg-[#e9eee9]"}`;

  return (
    <aside className="h-full px-3 py-3 md:px-4 md:py-5 overflow-y-auto">
      <div className="flex items-center gap-2 h-14 px-3 rounded-xl bg-white border border-[#dce3dc]">
        <img src={logo} alt="Company Logo" className="h-8 object-contain" />
        <div>
          <p className="font-bold text-base text-[#223022]">CoreFlow</p>
          <p className="text-[11px] text-[#748074] -mt-0.5">Business Suite</p>
        </div>
      </div>

      <nav className="mt-4 md:mt-6 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <MdDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <div>
          <button
            onClick={() => setOpenManage(!openManage)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[#304130] hover:bg-[#e9eee9] transition-colors"
          >
            <div className="flex items-center gap-3">
              <MdManageAccounts size={18} />
              <span className="font-medium">Manage</span>
            </div>

            <MdKeyboardArrowDown
              size={22}
              className={`transition-transform ${
                openManage ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`mt-2 ml-3 flex flex-col space-y-1 overflow-hidden transition-all duration-300
              ${openManage ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <NavLink to="/admin/customers" className={linkClass}>
              Customers
            </NavLink>

            <NavLink to="/admin/items" className={linkClass}>
              Items
            </NavLink>

            <NavLink to="/admin/vendors" className={linkClass}>
              Vendors
            </NavLink>
          </div>
        </div>

        <NavLink to="/admin/purchase" className={linkClass}>
          <FaShoppingCart size={16} />
          Purchase
        </NavLink>

        <NavLink to="/admin/sales" className={linkClass}>
          <MdPayments size={18} />
          Sales
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
