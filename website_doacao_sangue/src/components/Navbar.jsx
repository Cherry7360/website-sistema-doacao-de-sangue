
import { Link } from 'react-router-dom'

 function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-vermelhosg  p-2 flex justify-between items-center">
        <div className='logo_tipo text-black font-bold text-xl'>
           <Link to="/">Sistema de sangue</Link>
        </div>
      <div className="  text-black p-2 rounded">
        <ul className="flex space-x-6 text-black" >

        <li><Link to="/login" className="text-black font-bold no-underline">Login</Link></li>
        <li><Link to="/registar" className="text-black font-bold no-underline">Registar-se</Link></li>
        </ul>
      </div>
    </nav>
   
  )
}
export default Navbar
