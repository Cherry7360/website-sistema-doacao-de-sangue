
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Navbar=()=> {
const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    console.log("Tipo de usuário:", usuario?.role);

   
    const handleLogout = () => {
        logout();             
        navigate('/login');   
    };


  return (
    <nav className="fixed top-0 left-0 w-full h-[70px] px-6 flex justify-between items-center bg-vermelho shadow z-50">
        <div className='logo_tipo  text-white font-bold text-xl'>
           <Link to="/paginaprincipal">Sistema de sangue</Link>
        </div>
      <div className="  text-white first-line:p-2 rounded">
        <ul className="flex space-x-6" >
              {usuario?.role === 'funcionario' &&(
               <>
                  <li><Link to="/campanhas" className="text-white font-bold no-underline">campanhas</Link></li>
                <li><Link to="/dash">Dashboard</Link></li>
                </>
              )}
          {usuario?.role === 'doador' &&(
               <>
                  <li><Link to="/agendamento_doador" className="text-white font-bold no-underline">Agendamento</Link></li>
                  <li><Link to="/perfil" className="text-white font-bold no-underline">perfil</Link></li>
                  <li><Link to="/notificacao_doador" className="text-white font-bold no-underline">Notificações</Link></li>
                  <li><Link to="/doacoes_doador" className="text-white font-bold no-underline">Doações</Link></li>
               
               
                </>
              )}
            {!usuario && (
                <>
                  <li><Link to="/campanhas">Campanhas</Link></li>
                 <li><Link to="/login">Login</Link></li>
                 <li><Link to="/sabermais">Saber Mais</Link></li>
                  <li><Link to="/registar">Registar-se</Link></li>
                
                </>
              )}
        </ul>
      </div>
      <div className="navbar_actions">
            {usuario && (
             
                <button onClick={handleLogout}>Logout</button>
            
            )}
          </div>
    </nav>
   
  )
}
export default Navbar

/*     <ul className="flex space-x-6 text-white" >
        <li><Link to="/agendamento" className="text-white font-bold no-underline">Agendamento</Link></li>
        <li><Link to="/login" className="text-white font-bold no-underline">Login</Link></li>
        <li><Link to="/registar" className="text-white font-bold no-underline">Registar-se</Link></li>
        </ul>


*/