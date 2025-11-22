
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/login/Login';
import Layout from './layouts/Layout';
import Registar from './pages/Registar/Registar';
import PaginaPrincipal from './pages/PagianPrincipal/PaginaPrincipal';
import RotaProtegida from "./auth/rotaProtegida";


import AgendamentoFuncionario from './pages/Agendamento/AgendamentoFuncionario';

import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import Layoutdoador from './layouts/Layoutdoador';
import AgendamentoDoador from './pages/Agendamento/AgendamentoDoador';
import NotificacaoDoador from './pages/notificacao/NotificacaoDoador';
import NaoAutorizado from './pages/NaoAutorizado';
import PaginaErro from './pages/PaginaErro';
import PerfilDoador from './pages/Perfil/PerfilDoador';
import NotificacaoFuncionario from './pages/notificacao/NotificacaoFuncionario';
import DoacaoFuncionario from './pages/Doacao/DoacaoFuncionario';
import DoadorFuncionario from './pages/Doador/DoadorFuncionario';
import CampanhaFuncionario from './pages/Campanha/CampanhaFuncionario';
import CampanhasDoador from './pages/Campanha/CampanhasDoador';
import SaberMais from './pages/SaberMais/SaberMais';

function App() {
 
  return (
   <div>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Público */}
            <Route index path="paginaprincipal" element={<PaginaPrincipal />} />
            <Route path="loginUsuario" element={<Login />} />
            <Route path="registar" element={<Registar />} />
            <Route path="campanhas/doador" element={<CampanhasDoador/>} />
            <Route path="sabermais/requisitos_doador" element={<SaberMais/>}/>


            <Route path="dash" role="funcionario" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
                  <Route path="campanhas/gerir_campanhas"  role="funcionario" element={<RotaProtegida><CampanhaFuncionario/></RotaProtegida> }/>
              <Route path="doacoes/gerir_doacoes"  role="funcionario" element={<RotaProtegida><DoacaoFuncionario/></RotaProtegida> }/>
              <Route path="gerir_doadores"  role="funcionario" element={<RotaProtegida><DoadorFuncionario/></RotaProtegida> }/>
                    <Route path="agendamentos/gerir_agendamentos"  role="funcionario" element={<RotaProtegida><AgendamentoFuncionario/></RotaProtegida> }/>
              <Route path="notificacoes/gerir_notificacoes"  role="funcionario" element={<RotaProtegida><NotificacaoFuncionario/></RotaProtegida> }/>
            </Route>

             {/* Admin */}
            <Route element={<RotaProtegida role="admin" > <Dashboard/></RotaProtegida>}>
           
            </Route> 
            {/* Doador (protegido) */}
            <Route element={<RotaProtegida role="doador" > <Layoutdoador/></RotaProtegida>}>
              <Route path="agendamentos/agendar_doador"  role="doador" element={<RotaProtegida><AgendamentoDoador /></RotaProtegida> }/>
              <Route path="doadores/perfil"  role="doador" element={<RotaProtegida><PerfilDoador/></RotaProtegida> }/>
              <Route path="notificacoes/"  role="doador" element={<RotaProtegida><NotificacaoDoador/></RotaProtegida> }/>
           
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

