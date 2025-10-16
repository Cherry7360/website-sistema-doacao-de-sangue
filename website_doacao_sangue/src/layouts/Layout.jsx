import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

 const Layout=() =>{
  return (
    <div className="flex flex-col w-full h-screen">
        <Navbar/>
        <main  className="flex-1 mt-[60px] mb-[60px] p-8">
        <Outlet/>
        </main>
       
    </div>
  );
}
export default Layout;