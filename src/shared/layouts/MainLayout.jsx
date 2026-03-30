import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";

const MainLayout = () => {
  return (
    <div className="admin-shell">
      <div className="admin-frame flex flex-col md:flex-row">
        <div className="admin-sidebar w-full md:fixed md:top-0 md:left-0 md:h-screen md:w-64 z-20">
          <Sidebar />
        </div>

        <div className="flex-1 md:ml-64">
          <div className="admin-topbar h-16 md:fixed md:top-0 md:left-64 md:right-0 z-10">
            <Toolbar />
          </div>

          <main className="admin-main px-2 pb-2 pt-3 md:mt-17 md:px-2 md:pb-6 md:pt-0 min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
