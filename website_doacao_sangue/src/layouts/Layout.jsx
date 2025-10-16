import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

 const Layout=() =>{
  const { usuario} = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex flex-col w-full h-screen">
        <Navbar  onToggleSidebar={() => setShowSidebar(!showSidebar)} />
          {usuario?.role === "funcionario" && showSidebar && (
            <Sidebar></Sidebar>
      )}
        <main   className={`pt-16 p-4 transition-all duration-300 ${
          usuario?.role === "funcionario" && showSidebar ? "ml-64" : "ml-0"
        }`}>
        <Outlet/>
        </main>
       
    </div>
  );
}
export default Layout;