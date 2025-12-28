import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";
import {
  MdDashboard,
  MdPeople,
  MdInventory,
  MdLocalShipping,
  MdPayments,
  MdKeyboardArrowDown,
  MdManageAccounts,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [openManage, setOpenManage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setOpenManage(true);
    }
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition
     ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`;

  return (
    <aside className="w-50 h-screen bg-gray-900 text-white fixed left-0 top-0">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <img src={logo} alt="Company Logo" className="h-12 object-contain" />
      </div>

      <nav className="p-4 space-y-4">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <MdDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <div>
          <button
            onClick={() => setOpenManage(!openManage)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-gray-700 transition"
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
            className={`mt-2 ml-4 flex flex-col space-y-1 overflow-hidden transition-all duration-300
              ${openManage ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <NavLink to="/admin/customers" className={linkClass}>
              {/* <MdPeople size={18} /> */}
              Customers
            </NavLink>

            <NavLink to="/admin/items" className={linkClass}>
              {/* <MdInventory size={18} /> */}
              Items
            </NavLink>

            <NavLink to="/admin/vendors" className={linkClass}>
              {/* <MdLocalShipping size={18} /> */}
              Vendors
            </NavLink>

            <NavLink to="/admin/employees" className={linkClass}>
              {/* <FaUsers size={16} /> */}
              Employees
            </NavLink>

            <NavLink to="/admin/payments" className={linkClass}>
              {/* <MdPayments size={18} /> */}
              Payments
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
