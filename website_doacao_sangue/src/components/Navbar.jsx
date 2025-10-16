
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from "react-icons/fa";


const Navbar=({onToggleSidebar})=> {
 
const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();             
        navigate('/loginUsuario');   
    };

  return (
    <nav className={'fixed top-0 left-0 w-full h-[70px] px-6 flex justify-between items-center bg-vermelho shadow z-50'
     }> 
        <div className='logo_tipo logo_tipo h-full flex items-center text-white font-bold text-xl'>
           <Link to="/paginaprincipal">Sistema de sangue</Link>
           
           {usuario?.role === 'funcionario' &&(
               <>
                  <button onClick={onToggleSidebar}  className="text-2xl p-2 rounded hover:bg-red-600 transition-colors">
                    <FaBars />
                  </button>
                </>
              )}
        </div>
      <div className="  text-white first-line:p-2 rounded">
        <ul className="flex space-x-6" >
              
          {usuario?.role === 'doador' &&(
               <>
                  <li><Link to="/agendamentos/agendar_doador" className="text-white font-bold no-underline">Agendamento</Link></li>
                  <li><Link to="/doadores/perfil" className="text-white font-bold no-underline">Perfil</Link></li>
                  <li><Link to="/notificacoes" className="text-white font-bold no-underline">Notificações</Link></li>
                </>
              )}
          {!usuario && (
                <>
                  <li><Link to="/campanhas">Campanhas</Link></li>
                  <li><Link to="/loginUsuario">Login</Link></li>
                  <li><Link to="/sabermais">Saber Mais</Link></li>
                  <li><Link to="/registar">Registar-se</Link></li>
                </>
              )}
        </ul>
      </div>
      <div className="navbar_actions flex items-center space-x-4">
            {usuario && (
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors"
                  onClick={handleLogout}>Logout</button>
            
            )}
          </div>
    </nav>
   
  )
}
export default Navbar
// <li><Link to="/doacoes_doador" className="text-white font-bold no-underline">Doações</Link></li>