import { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItems } from "./Navegation";
import { useAuth } from "../context/AuthContext";
import {HiOutlineMenu, HiOutlineHome, HiOutlineHeart, HiOutlineSpeakerphone,
  HiOutlineCalendar, HiOutlineBell, HiOutlineUsers
} from "react-icons/hi";
import axios from "axios";
const getIcon = (name) => {
  switch (name) {
    case "Dashboard": return <HiOutlineHome />;
    case "Agendamento": return <HiOutlineCalendar />;
    case "Doacao": return <HiOutlineHeart />;
    case "Campanhas": return <HiOutlineSpeakerphone />;
    case "Notificações": return <HiOutlineBell />;
    case "Doadores": return <HiOutlineUsers />;
    default: return <HiOutlineMenu />;
  }
};




const Sidebar = () => {
  const location = useLocation();
  const { usuario } = useAuth();
  const [infoFuncionario,setInfoFuncionario]=useState(null)

  const [aberto, setAberto] = useState(true);

  const fechar = () => setAberto(false);

  const token = localStorage.getItem("token"); 


  const fetchFuncionarioInfo= async ()=>{
    try {
        const res = await axios.get(`http://localhost:5080/usuario/funcionario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInfoFuncionario(res.data)
    }catch(error){
      console.error(error);
    }
  }

  useEffect(()=>{
    fetchFuncionarioInfo();
  },[]);

  return (
    <>
 

      <aside
        className={`
          fixed top-[70px] left-0 h-[calc(100%-70px)] w-64 bg-white shadow-xl
          transition-transform duration-300 z-40
          ${aberto ? "translate-x-0" : "-translate-x-64"}
        `}
      >

      
        <button
          onClick={fechar}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

{infoFuncionario && (
  <div className="flex flex-col items-center mb-8 p-4 bg-gray-50 border-b border-gray-200 rounded-lg shadow-sm">

    {infoFuncionario.foto ? (
      <img
        src={`http://localhost:5080${infoFuncionario.foto}`}
        alt="Foto do funcionário"
        className="w-16 h-16 rounded-full object-cover border-4 border-red-500 mb-2"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2 text-2xl border-2 border-red-400">
        {infoFuncionario.nome?.charAt(0).toUpperCase() || "U"}
      </div>
    )}

    <h3 className="font-extrabold text-lg text-gray-800">
      {infoFuncionario.nome}
    </h3>

    <p className="text-sm text-red-600 font-semibold">
      {infoFuncionario.tipo_usuario === "funcionario" && "Enfermeiro(a)/Médico(a)"}
      {infoFuncionario.tipo_usuario === "admin" && "Administrador(a)"}
    </p>
  </div>
)}

      
        <nav>
          <ul className="space-y-1">
            {NavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const ItemIcon = item.icon || getIcon(item.name);

              return (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 py-2 px-3 rounded-md transition-all duration-200
                      ${isActive
                        ? "bg-red-100 text-red-700 font-bold border-r-4 border-red-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 font-medium"
                      }
                    `}
                  >
                    <span className="text-xl w-6 flex justify-center">{ItemIcon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
