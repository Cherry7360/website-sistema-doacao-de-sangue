
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/login/Login';
import Layout from './layouts/Layout';
import Registar from './pages/Registar/Registar';
import PaginaPrincipal from './pages/PagianPrincipal/PaginaPrincipal';
import RotaProtegida from "./auth/rotaProtegida";


import AgendamentoFuncionario from './pages/Agendamento/AgendamentoFuncionario';

import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

import Usuarios from './pages/admin/Users';
import DoacaoDoador from './pages/Doacao/DoacaoDoador';
import AgendamentoDoador from './pages/Agendamento/AgendamentoDoador';
import NotificacaoDoador from './pages/notificacao/NotificacaoDoador';
import NotAuthorized  from './pages/errors/NotAuthorized';
import NotFound from './pages/errors/NotFound';
import PerfilDoador from './pages/Perfil/PerfilDoador';
import NotificacaoFuncionario from './pages/notificacao/NotificacaoFuncionario';
import DoacaoFuncionario from './pages/Doacao/DoacaoFuncionario';
import DoadorFuncionario from './pages/Doador/DoadorFuncionario';
import CampanhaFuncionario from './pages/Campanha/CampanhaFuncionario';
import CampanhasDoador from './pages/Campanha/CampanhasDoador';
import SaberMais from './pages/SaberMais/SaberMais';
import EstoqueFuncionario from './pages/Estoque/EstoqueFuncionario';
function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            {/**rotas públicas*/}
              <Route index path="paginaprincipal" element={<PaginaPrincipal />} />
              <Route path="loginUsuario" element={<Login />} />
              <Route path="registar" element={<Registar />} />
              <Route path="campanhas/doador" element={<CampanhasDoador/>} />
              <Route path="sabermais/requisitos_doador" element={<SaberMais/>}/>

              {/**rotas do administrador e dos funcionarios */}
              <Route path="dashboard" role={['funcionario', 'admin']} element={<RotaProtegida><Dashboard /></RotaProtegida>} />
                <Route path="usuarios" role={ 'admin'} element={<RotaProtegida><Usuarios /></RotaProtegida>} />
                <Route path="campanhas"  role={['funcionario', 'admin']} element={<RotaProtegida><CampanhaFuncionario/></RotaProtegida> }/>
                <Route path="doacoes"  role={['funcionario', 'admin']} element={<RotaProtegida><DoacaoFuncionario/></RotaProtegida> }/>
                <Route path="doadores"  role={['funcionario', 'admin']} element={<RotaProtegida><DoadorFuncionario/></RotaProtegida> }/>
                <Route path="agendamentos"  role={['funcionario', 'admin']} element={<RotaProtegida><AgendamentoFuncionario/></RotaProtegida> }/>
                <Route path="notificacoes/funcionario"  role={['funcionario', 'admin']} element={<RotaProtegida><NotificacaoFuncionario/></RotaProtegida> }/>
                <Route path="estoque"  role={['funcionario', 'admin']} element={<RotaProtegida><EstoqueFuncionario/></RotaProtegida> }/>
              </Route>
              {/**rotas do doador */}
              <Route element={<RotaProtegida role="doador" > <Layout/></RotaProtegida>}>
                <Route path="agendamentos/doador"  role="doador" element={<RotaProtegida><AgendamentoDoador /></RotaProtegida> }/>
                <Route path="doadores/meu-perfil"  role="doador" element={<RotaProtegida><PerfilDoador/></RotaProtegida> }/>
                <Route path="notificacoes/"  role="doador" element={<RotaProtegida><NotificacaoDoador/></RotaProtegida> }/>
                <Route path="doacoes/doador"  role="doador" element={<RotaProtegida><DoacaoDoador/></RotaProtegida> }/>
            
              </Route> 

              <Route path="/nao-autorizado" element={<NotAuthorized />} />

              <Route path="*" element={<NotFound/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
   
  )
}

export default App

