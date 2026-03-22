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
      <header className="h-full flex items-center justify-end px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCompanyClick}
            className="text-sm font-semibold px-3 py-2 rounded-lg text-[#355835] hover:bg-[#ebf1eb]"
          >
            {companyName || "Select Company"}
          </button>
          <span className="h-6 w-px bg-[#d4ddd4]"></span>

          <button className="relative p-2 rounded-lg text-[#556555] hover:bg-[#ebf1eb]">
            <FaBell size={17} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <span className="h-6 w-px bg-[#d4ddd4]"></span>

          <MdExplore
            size={19}
            title="Other Products"
            className="text-[#556555]"
          />

          <span className="h-6 w-px bg-[#d4ddd4]"></span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#7a4545] hover:text-[#a13a3a] transition text-sm font-semibold"
          >
            <FiLogOut size={16} />
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
