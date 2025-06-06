

import {BrowserRouter, Routes, Route} from 'react-router-dom'


import Login from './pages/login/Login';
import Layout from './components/Layout';
import Registar from './pages/Registar/Registar';
import PaginaPrincipal from './pages/PagianPrincipal/PaginaPrincipal';

function App() {
 
  return (
   <div>
    <BrowserRouter>
      
        <Routes>
          <Route path='/' element={<Layout/>}>
          <Route index element={<PaginaPrincipal/>} />
          <Route path='/login'element={<Login/>} />
          <Route path='/registar' element={<Registar/>}/>
          </Route>
        </Routes>
      
    </BrowserRouter>

   </div>
   
  )
}

export default App
