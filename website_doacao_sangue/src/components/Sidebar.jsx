import { Link, useLocation } from "react-router-dom";
import { NavItems } from "./Navegation";

const Sidebar = () => {
  const location = useLocation(); 
  console.log("ROTA ATUAL:", location.pathname);
console.log("NAV ITEMS:", NavItems);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-vermelho text-white p-4">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <nav>
        <ul className="space-y-2 text-white">
          {NavItems.map((item) => (
            <li key={item.key}>
              <Link
                to={item.path}
                className={`block py-2 px-3 rounded transition-colors ${
                  location.pathname === item.path
                    ? "bg-black text-white" // ativo
                    : "hover:bg-blue-600 text-gray-300 hover:text-white" // normal
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
