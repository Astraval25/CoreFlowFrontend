import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { MdExplore } from "react-icons/md";
import CompanyDrawer from "../../features/companyDrawer/CompanyDrawer";

const Toolbar = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [openCompanyPanel, setOpenCompanyPanel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      if (decode.defaultComp.length) {
        setCompanyName(decode.defaultComp[1]);
        console.log(decode.defaultComp[1]);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const handleCompanyClick = () => {
    setOpenCompanyPanel(true);
  };

  return (
    <>
      <header className="h-14 bg-gray-900 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
        <h1 className="text-lg font-semibold text-white">CoreFlow</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCompanyClick}
            className="text-sm font-medium px-3 py-1 text-blue-500 hover:underline"
          >
            {companyName || "Select Company"}
          </button>
          <span className="h-6 w-px bg-gray-300"></span>

          <button className="relative p-2 rounded-lg">
            <FaBell size={18} className="text-white"/>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <span className="h-6 w-px bg-gray-300"></span>

          <MdExplore size={20} title="Other Products" className="text-white"/>

          <span className="h-6 w-px bg-gray-300"></span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition text-sm font-medium"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <CompanyDrawer
        open={openCompanyPanel}
        onClose={() => setOpenCompanyPanel(false)}
      />
    </>
  );
};

export default Toolbar;
