import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";

const MainLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-50 min-h-screen bg-gray-100">
        <Toolbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
