import { useLocation, Link,useNavigate } from "react-router-dom";
import { NavItems } from "./Navegation";
import { NavItemsDoador } from "./NavegationDoador";
import { useAuth } from "../context/AuthContext";
import { HiMenu, HiLogout,HiHome,HiHeart,HiSpeakerphone,HiCalendar,HiBell,HiUser} from "react-icons/hi";
import { useState, useEffect } from "react";
import axios from "axios";

// Função que retorna o ícone correspondente ao nome do item de navegação
const getIcon = (name) => {
  switch (name) {
    case "Dashboard":
      return <HiHome />;
    case "Agendamento":
      return <HiCalendar />;
    case "Doacao":
      return <HiHeart />;
    case "Campanhas":
      return <HiSpeakerphone />;
    case "Notificações":
      return <HiBell />;
    case "Doadores":
      return <HiUser />;
    default:
      return <HiMenu />;
  }
};

// Componente Sidebar que renderiza a barra lateral de navegação com itens filtrados pelo role do usuário
const Sidebar = ({ aberto, fechar }) => {


  const location = useLocation();
  const { usuario ,logout} = useAuth();
  const navigate = useNavigate();

  const [info_usuario, setInfoUsuario] = useState(null);
  const token = localStorage.getItem("token");

const handleLogout = () => {
  logout();
  navigate("/loginUsuario");
};

  const items = usuario?.role === "doador" ? NavItemsDoador : NavItems;

  const itemsFiltrados = items.filter(
    item => item.roles?.includes(usuario.role)
  );

  // Hook que busca informações do usuário a partir do token
  useEffect(() => {
    if (!token) return;

    const fetchDadosUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5080/dashboard/perfil",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInfoUsuario(res.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };

    fetchDadosUser();
  }, [token]);

  if (!usuario) return null;

  return (
    <aside
      className={`
        fixed top-[70px] left-0 h-[calc(100vh-70px)] w-64 bg-white shadow-xl
        transition-transform duration-300 z-40
        flex flex-col
        ${aberto ? "translate-x-0" : "-translate-x-64"}
      `}
    >
      <button
        onClick={fechar}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
      >
        ×
      </button>

      <div className="flex flex-col items-center mb-8 p-4 bg-gray-50 border-b border-gray-200 rounded-lg shadow-sm">
        {info_usuario?.foto ? (
          <img
            src={`http://localhost:5080/${info_usuario.foto}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 mb-2"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2 text-2xl border-2">
            {info_usuario?.nome?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <p className="text-gray-800 font-semibold text-center">
          {info_usuario?.nome || "Usuário"}
        </p>

        <p className="text-sm text-green-600 font-semibold capitalize">
          {info_usuario?.tipo_usuario}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-0 px-2">
          {itemsFiltrados.map((item) => {
            const isActive = location.pathname === item.path;
            const ItemIcon = item.icon || getIcon(item.name);

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center space-x-3 py-2 px-3 rounded-md transition-all
                    ${
                      isActive
                        ? "bg-red-100 text-red-700 font-bold border-r-4 border-red-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 font-medium"
                    }
                  `}
                >
                  <span className="text-xl w-6 flex justify-center">
                    {ItemIcon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className=" mt-auto w-full px-2 border-t pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 py-2 px-3 rounded-md transition-all w-full
                    text-gray-700 hover:bg-red-100 hover:text-red-700 font-medium"
        >
          <span className="text-xl w-6 flex justify-center">
            <HiLogout />
          </span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;