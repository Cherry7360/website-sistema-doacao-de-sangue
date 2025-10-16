import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = () => {
  return (
     <div className="min-h-screen flex">
      <div className="fixed top-0 left-0 h-screen w-64 bg-gray-100 border-r"><Sidebar /></div>
      <div className="flex-1 ml-64">
      <Header/>

    <div className="mt-16 p-6">
          <Outlet />
        </div>
      </div>
  </div>
  );
}

export default DashboardLayout;

/*
      <aside className="fixed top-16 left-0 h-[calc(100%-4rem)] left-0 h-full w-64 bg-gray-100 border-r">
        <Sidebar />
      </aside>

      
      <div className="flex-1 flex flex-col ml-64">
       
        <Header></Header>

       
        <main className="pt-16 p-4 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>*/
 
