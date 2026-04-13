import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";

const MainLayout = () => {
  const [sidebarMinimized, setSidebarMinimized] = useState(() => {
    try {
      return localStorage.getItem("cf_sidebar_minimized") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cf_sidebar_minimized", sidebarMinimized ? "1" : "0");
    } catch {
      // ignore storage failures
    }
  }, [sidebarMinimized]);

  const sidebarWidth = sidebarMinimized ? "md:w-20" : "md:w-64";
  const contentOffset = sidebarMinimized ? "md:ml-20" : "md:ml-64";
  const topbarOffset = sidebarMinimized ? "md:left-20" : "md:left-64";

  return (
    <div className="admin-shell">
      <div className="admin-frame flex flex-col md:flex-row">
        <div className={`admin-sidebar w-full md:fixed md:top-0 md:left-0 md:h-screen ${sidebarWidth} z-20 transition-all duration-200`}>
          <Sidebar
            minimized={sidebarMinimized}
            onToggleMinimize={() => setSidebarMinimized((prev) => !prev)}
          />
        </div>

        <div className={`flex-1 ${contentOffset} transition-all duration-200`}>
          <div className={`admin-topbar h-16 md:fixed md:top-0 ${topbarOffset} md:right-0 z-10 transition-all duration-200`}>
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
