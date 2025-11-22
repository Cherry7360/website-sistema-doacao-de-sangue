import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars } from "react-icons/fa";
import { IoMdPerson, IoMdNotifications, IoMdCalendar } from "react-icons/io";
import { useState } from "react";

const NotificacaoBadge = ({ count }) => (
    count > 0 ? (
        <span className="absolute top-0 right-[-10px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {count > 9 ? '9+' : count}
        </span>
    ) : null
);

const Navbar = ({ onToggleSidebar }) => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

   const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
    

    const handleLogout = () => {
        logout();
        navigate('/loginUsuario');
    };

    return (
        <div>
            <div>
        <nav className={'fixed top-0 left-0 w-full h-[70px] px-8 flex justify-between items-center bg-red-800 shadow-lg z-50'}>
            <div className='logo_tipo h-full flex items-center text-white font-extrabold text-2xl'>
                {/* Branding: Ícone de gota */}
                <Link to="/paginaprincipal" className="flex items-center space-x-2 mr-6 hover:text-red-300 transition-colors">
                    <span className="text-3xl text-red-400">🩸</span>
                    <span>Sistema de Doação</span>
                </Link>

                {/* Mostrar botão do sidebar apenas se for funcionario ou admin */}
                {(usuario?.role === 'funcionario' || usuario?.role === 'admin') && (
                    <button
                    onClick={onToggleSidebar}
                    className="text-2xl p-2 rounded hover:bg-red-700 transition-colors"
                    >
                    <FaBars />
                    </button>
                )}
            </div>

            {/* (Doador / Não Logado) */}
            <div className="text-white">
                <ul className="flex space-x-6 items-center" >
                    {usuario?.role === 'doador' && (
                        <>
                            <li>
                                <Link to="/agendamentos/agendar_doador" 
                                      className="flex items-center text-white font-medium hover:text-red-300 no-underline transition-colors">
                                    <IoMdCalendar className="mr-1" /> Agendamento
                                </Link>
                            </li>
                            <li>
                                <Link to="/doadores/perfil" 
                                      className="flex items-center text-white font-medium hover:text-red-300 no-underline transition-colors">
                                    <IoMdPerson className="mr-1" /> Perfil
                                </Link>
                            </li>
                         
                            <li>
                                <Link to="/notificacoes" 
                                      className="relative flex items-center text-white font-medium hover:text-red-300 no-underline transition-colors">
                                    <IoMdNotifications className="mr-1" /> Notificações
                                    <NotificacaoBadge count={notificacoesNaoLidas} />
                                </Link>
                            </li>
                        </>
                    )}

                   
                    {!usuario && (
                        <>
                            <li><Link to="/campanhas/doador" className="font-medium hover:text-red-300 transition-colors">Campanhas</Link></li>
                            <li><Link to="/sabermais/requisitos_doador" className="font-medium hover:text-red-300 transition-colors">Saber Mais</Link></li>
                            
                            <li><Link to="/loginUsuario" className="font-medium hover:text-red-300 transition-colors">Login</Link></li>
                          
                            <li>
                                <Link to="/registar" 
                                      className="bg-white text-red-800 font-bold px-4 py-2 rounded hover:bg-gray-100 transition-colors shadow-md">
                                    Registar-se
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
          
            <div className="navbar_actions flex items-center space-x-4">
                {usuario && (
                    <button className="text-white hover:text-red-300 font-medium px-3 py-2 rounded transition-colors border border-transparent hover:border-white"
                        onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
        </div>
        </div>
    );
}

export default Navbar;