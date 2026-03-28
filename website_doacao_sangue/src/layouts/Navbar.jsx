import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {
  const { usuario} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisto = location.pathname === '/registar';

  const handleLogout = () => {
    logout();
    navigate('/loginUsuario');
  };

  return (
    <nav className='fixed top-0 left-0 w-full h-[70px] px-8 flex justify-between items-center bg-red-800 shadow-lg z-50'>
      
      <div className='flex items-center text-white font-extrabold text-2xl'>
        <Link
          to="/paginaprincipal"
          className="flex items-center space-x-2 hover:text-red-300 transition-colors"
        >
          <span className="text-3xl text-red-400">🩸</span>
          <span>Doe+Vida</span>
        </Link>

        {usuario && (
          <button
            onClick={onToggleSidebar}
            className="text-2xl p-2 rounded hover:bg-red-700 transition-colors ml-4"
          >
            <FaBars />
          </button>
        )}
      </div>

      <div className="text-white">
        {!usuario && (
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                to="/campanhas/doador"
                className="font-medium hover:text-red-300"
              >
                Campanhas
              </Link>
            </li>

            <li>
              <Link
                to="/sabermais/requisitos_doador"
                className="font-medium hover:text-red-300"
              >
                Saber Mais
              </Link>
            </li>

            {!isRegisto && (
              <>
                <li>
                  <Link
                    to="/loginUsuario"
                    className="font-medium hover:text-red-300"
                  >
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    to="/registar"
                    className="bg-white text-red-800 font-bold px-4 py-2 rounded shadow-md hover:bg-gray-100"
                  >
                    Registar-se
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}

        
      </div>

    </nav>
  );
};

export default Navbar;