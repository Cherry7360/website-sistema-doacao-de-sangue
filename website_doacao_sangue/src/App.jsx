
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/login/Login';
import Layout from './layouts/Layout';
import Registar from './pages/Registar/Registar';
import PaginaPrincipal from './pages/PagianPrincipal/PaginaPrincipal';
import RotaProtegida from "./auth/rotaProtegida";


import Agendamento from './pages/Agendamento/Agendamento';
import Dashboardlayout from './layouts/Dashboardlayout';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import Layoutdoador from './layouts/Layoutdoador';
import AgendamentoDoador from './pages/Agendamento/AgendamentoDoador';
import NotificacaoDoador from './pages/notificacao/NotificacaoDoador';
import NaoAutorizado from './pages/NaoAutorizado';
import PaginaErro from './pages/PaginaErro';
import PerfilDoador from './pages/Perfil/PerfilDoador';
import Doacao from './pages/Doacao/Doacao';
import Notificacoes from './pages/notificacao/Notificacoes';
import Doadores from './pages/Doador/Doadores';

function App() {
 
  return (
   <div>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
  <Route path="/" element={<Layout />}>
    {/* Público */}
    <Route index path="paginaprincipal" element={<PaginaPrincipal />} />
    <Route path="login" element={<Login />} />
    <Route path="registar" element={<Registar />} />
     </Route>


    {/* Doador (protegido) */}
    <Route element={<RotaProtegida role="doador" > <Layoutdoador/></RotaProtegida>}>
      <Route path="agendamento_doador"  role="doador" element={<RotaProtegida><AgendamentoDoador /></RotaProtegida> }/>
      <Route path="perfil"  role="doador" element={<RotaProtegida><PerfilDoador/></RotaProtegida> }/>
       <Route path="notificacao_doador"  role="doador" element={<RotaProtegida><NotificacaoDoador/></RotaProtegida> }/>

    </Route> 

    {/* Funcionário (protegido) */}
    <Route element={<RotaProtegida role="funcionario" > <Dashboardlayout/></RotaProtegida>}>
      <Route path="dash" role="funcionario" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="gerir_doacoes"  role="funcionario" element={<RotaProtegida><Doacao/></RotaProtegida> }/>
      <Route path="gerir_doadores"  role="funcionario" element={<RotaProtegida><Doadores/></RotaProtegida> }/>
      <Route path="gerir_notificacoes"  role="funcionario" element={<RotaProtegida><Notificacoes/></RotaProtegida> }/>
    </Route>

   {/* Página 403 */}
        <Route path="/nao-autorizado" element={<NaoAutorizado />} />

     <Route path="*" element={<PaginaErro/>} />
</Routes>
      </BrowserRouter>
    </AuthProvider>
   </div>
   
  )
}

export default App

/* 
<Route path='/' element={<Dashboardlayout/>}>
             <Route index path='/dash' element={<Dashboard/>}/>
             <Route path='/doacao' element={<Doacao/>}/>
  return (
   <div>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Layout />}>
           <Route path="paginaprincipal" element={< PaginaPrincipal />} />
            <Route path="login" element={<Login />} />
            <Route path="registar" element={<Registar />} />
        </Route>


        
        <Route
          path="/"
          element={
            <RotaProtegida tipo="doador">
              <Layout/> 
            </RotaProtegida>
          }
        >
          <Route path="agendamento" element={<RotaProtegida tipo="doador"><Agendamento /></RotaProtegida> }/>
            <Route path="doacao" element={<RotaProtegida tipo="doador"> <Doacao /></RotaProtegida>} />
        

      
        <Route
          path="/funcionario"
          element={
            <RotaProtegida tipo="funcionario">
              <Dashboardlayout/>
            </RotaProtegida>
          }
        >
          <Route index element={ <RotaProtegida tipo="funcionario"><Dashboard /> </RotaProtegida>} />
         </Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
   </div>
   
  )
}          

             */