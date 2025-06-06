import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

 const Layout=() =>{
  return (
    <div className="flex flex-col w-full h-screen">
        <Navbar/>
        <main  className="flex-1 mt-[60px] mb-[60px] p-8">
        <Outlet/>
        </main>
        <Footer/>
    </div>
  );
}
export default Layout;