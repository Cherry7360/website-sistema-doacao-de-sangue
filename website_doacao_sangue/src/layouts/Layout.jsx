import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { usuario } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="flex flex-1">
        {usuario && (
          <Sidebar aberto={showSidebar} fechar={() => setShowSidebar(false)} />
        )}
        <main
          className={`flex-1 pt-16  transition-all duration-300
            ${showSidebar && usuario ? "ml-64" : "ml-0"}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
