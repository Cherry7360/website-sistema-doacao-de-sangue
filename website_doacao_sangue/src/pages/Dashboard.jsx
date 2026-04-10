import {HiOutlineCalendar,HiOutlineUserCircle, HiOutlineUsers, HiBeaker, HiOutlineSpeakerphone, HiClock,HiOutlineViewGrid } from "react-icons/hi";
import { useEffect, useState } from "react";
import Grafico from "../components/Grafico";
import GraficoCircular from "../components/GraficoCircular";
import GraficoEstoque from "../components/GraficoEstoque";
import axios from "axios";
import Button from "../components/Button";

import AlertCard from "../components/AlertCard";

const BASE_URL  = "http://localhost:5080/dashboard";

const Dashboard = () => {

 
  const [dados, setDados] = useState({
    totalDoadores: 0,
    totalFuncionarios: 0,
    });
   const [doacoes, setDoacoes] = useState([]);
   const [campanhas, setCampanhas] = useState([]);
   const [doadores, setDoadores] = useState([]);

  const [totaisEstoque, setTotaisEstoque]=useState({});
  const [alert, setAlert] = useState(null);
 

  const token = localStorage.getItem("token"); 


  useEffect(() => {
    fetchDashboard();
    fetchDadosEstoque();
  }, []);


  // Função que busca os dados agregados para o dashboard
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(BASE_URL );
        const masculino = res.data.Totalmasculino;
    const feminino  = res.data.Totalfeminino;
      setDados({
        totalDoadores: res.data.totalDoadores,
        totalFuncionarios: res.data.totalFuncionarios,
        totalCampanhas: res.data.campanhasAtivas
      });
      setDoacoes(res.data.doacoesPorAno || []);
      setCampanhas(res.data.campanhasPorAno || []);
      setDoadores([
      { name: "Masculino", value: masculino },
      { name: "Feminino", value: feminino },
        ]);
       
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    }
  };

  const fetchDadosEstoque= async () => {
      try {
        const res = await axios.get(`http://localhost:5080/estoque/total`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotaisEstoque(res.data.totais);
      } catch (err) {
        console.error("Erro ao buscar total de estoque:", err);
      }
    };
// funcao que envia notificacao por email quando ha grupo sanguineos em estado critico
    const enviarNotificacao = async ()=>{
  try {
        const res = await axios.post(`http://localhost:5080/notificacoes/estoque-critico`, 
           { tipos: criticos }, 
          {
          headers: { Authorization: `Bearer ${token}` }
        });

         setAlert({ type: "success", message: "notificação enviada com sucesso!" });
    
       console.log('notificacao estado critico para doadores')
      } catch (err) {
           setAlert({ type: "error", message: "Erro ao remover enviar notificacao!" });
 
        console.error("Erro ao buscar total de estoque:", err);
      }
    };



    // Combinar doacoesPorAno e campanhasPorAno
    const combinarPorAno = () => {
      const anos = new Set([
        ...doacoes.map(d => d.ano),
        ...campanhas.map(c => c.ano),
      ]);

      const resultado = Array.from(anos).map(ano => {
        const doacoesAno = doacoes.find(d => d.ano === ano);
        const campanhasAno = campanhas.find(c => c.ano === ano);
        return {
          ano,
          doacoes: doacoesAno ? doacoesAno.total : 0,
          campanhas: campanhasAno ? campanhasAno.total : 0,
        };
      });

      return resultado.sort((a, b) => a.ano - b.ano);
      
    };



const criticos = Object.keys(totaisEstoque || {}).filter(
  (tipo) => totaisEstoque[tipo]?.status === "critico"
);

const totalEstoque = Object.values(totaisEstoque || {}).reduce(
  (acc, item) => acc + (item?.quantidade || 0),
  0
);

 return (
  <div className="px-4 sm:px-6 lg:px-20 py-8 bg-gray-50">
      {alert && (
          <div className="fixed top-5 right-5 z-50">
            <AlertCard
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}
    <div className=" mx-auto space-y-10">

      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
       <div>
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Visão geral do sistema • {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        
    
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-600 rounded-xl p-3">
              <HiOutlineUsers className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">Doadores cadastrados</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {dados.totalDoadores || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 rounded-xl p-3">
              <HiOutlineUserCircle className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">Funcionários ativos</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {dados.totalFuncionarios || "—"}
              </p>
            </div>
          </div>
        </div>

    
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 text-amber-600 rounded-xl p-3">
              <HiOutlineCalendar className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">Campanhas em andamento</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {dados.totalCampanhas || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-violet-100 hover:shadow transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 text-violet-600 rounded-xl p-3">
              <HiBeaker className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">Estoque Total</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {totalEstoque || "—"} <span className="text-base font-normal text-gray-500">ml</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Atualizado há 12 minutos</p>
            </div>
          </div>
        </div>

      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Gráfico de Estoque por Tipo Sanguíneo */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Estado atual do estoque</h2>
          <div className="  items-center">
            <div >
              <GraficoEstoque totaisEstoque={totaisEstoque || {}} />
            </div>

         
          </div>
        </div>

        {/* Sugestão do Sistema */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sugestão do Sistema</h2>
          
          {criticos.length > 0 ? (
            <div className="space-y-5">
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                <p className="font-medium text-red-800">Atenção: Estoque crítico</p>
                <p className="text-sm text-red-700 mt-2">
                  Tipos afetados: <strong>{criticos.join(", ")}</strong>
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl text-sm font-medium w-full"
               onClick={enviarNotificacao}>
                Enviar notificação aos doadores
              </Button>
            </div>
          ) : (
            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
              <p className="text-emerald-700 font-medium">
                Todos os tipos sanguíneos estão em níveis seguros.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gráficos Inferiores*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm">
          <Grafico
            dados={combinarPorAno()}
            titulo="Doações e Campanhas por Ano"
            xKey="ano"
            barras={[
              { chave: "doacoes", cor: "#10b981" },
              { chave: "campanhas", cor: "#3b82f6" },
            ]}
            altura={340}
          />
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-sm">
          <GraficoCircular doadores={doadores} />
        </div>
      </div>

    </div>
  </div>
);
};

export default Dashboard;
