import { Link, useLocation } from "react-router-dom";
import { NavItems } from "./Navegation";
import { FaBars, FaTimes, FaHome, FaUser } from "react-icons/fa";


const Sidebar = () => {

  const location = useLocation(); 

  //console.log("ROTA ATUAL:", location.pathname);
  //console.log("NAV ITEMS:", NavItems);
  return (
    <div>
      <button className="text-white text-xl">
        <FaBars />
      </button>
        <aside className="fixed top-[70px] left-0 h-[calc(100%-70px)] w-64 bg-white text-black p-4 shadow-lg">
          <nav>
            <ul className="space-y-2 text-black">
              {NavItems.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className={`block py-2 px-3 rounded transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white" // item ativo
                        : "text-black hover:bg-gray-200" // item normal
                    }`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
    </div>
  );
};

export default Sidebar;
