import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";

const MainLayout = () => {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-52 bg-white z-20">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 ml-52">
        <div className="fixed top-0 left-52 right-0 h-16 bg-white z-10">
          <Toolbar />
        </div>

        <main className="mt-16 p-6 min-h-screen bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
