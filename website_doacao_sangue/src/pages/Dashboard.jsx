import {HiTrendingUp, HiOutlineUsers, HiOutlineHeart, HiOutlineSpeakerphone, HiClock,HiOutlineViewGrid } from "react-icons/hi";
import { useEffect, useState } from "react";
import Grafico from "../components/Grafico";
import GraficoCircular from "../components/GraficoCircular";

import GotaNivel from "../components/GotaNivel";
import axios from "axios";

const BASE_URL  = "http://localhost:5080/dashboard";
const MAX_DOACOES = 20;

const Dashboard = () => {

 
  const [dados, setDados] = useState({
    totalDoadores: 0,
    totalDoacoes: 0,
    totalFuncionarios: 0,
    campanhasAtivas: 0,

  });
   const [doacoes, setDoacoes] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [agendamentosHoje, setAgendamentosHoje] = useState([]);
  const [doadores, setDoadores] = useState([]);
const [estoqueSangue, setEstoqueSangue] = useState([]);


  useEffect(() => {
    fetchDashboard();
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
      });
      setDoacoes(res.data.doacoesPorAno || []);
      setCampanhas(res.data.campanhasPorAno || []);
      setDoadores([
      { name: "Masculino", value: masculino },
      { name: "Feminino", value: feminino },
        ]);

        console.log(res.data.estoqueSangue);
        setEstoqueSangue(res.data.estoqueSangue || []);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    }
  };

  const estoqueConvertido = estoqueSangue.map(item => ({
  tipo: item.tipo,
  nivel: Math.min(Math.round((item.total / MAX_DOACOES) * 100), 100),
}));
  const Cards=({accentColor,
      icon,
      iconBg = "bg-gray-100",
      iconColor = "text-gray-600",
      title,
      value,
      subtitle,
      highlight
    }) => (  <div
        className={`relative bg-white rounded-xl shadow-sm p-6 flex gap-4 
        ${highlight ? "ring-2 ring-red-500" : ""}`}
      >
        <span className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${accentColor}`} />
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBg}`}>
          <span className={`text-xl ${iconColor}`}>
            {icon}
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
  </div>)

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


    const formatDateLocal = (dateStr) => {
      if (!dateStr) return "—";
      const [year, month, day] = dateStr.split("-"); // separa ano-mês-dia
      const date = new Date(year, month - 1, day); // constrói data local
      return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

  return (
    <div className="px-4 lg:px-16 py-6 bg-gray-50 min-h-screen space-y-8">

  <div className="flex items-center gap-2 mb-4">
    <HiOutlineViewGrid className="text-2xl text-gray-700" />
    <h1 className="text-2xl font-bold">Dashboard</h1>
  </div>


  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-fit ">
    <Cards
      accentColor="bg-red-300"
      icon={<HiOutlineUsers />}
      iconBg="bg-red-200"
      iconColor="text-red-600"
      title="Total de doadores"
      value={dados.totalDoadores || "—"}
    />
    <Cards
      accentColor="bg-blue-300"
      icon={<HiOutlineUsers />}
      iconBg="bg-blue-200"
      iconColor="text-blue-600"
      title="Total de funcionários"
      value={dados.totalFuncionarios || "—"}
    />
  </div>




  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm">
      <Grafico
        dados={combinarPorAno()}
        titulo="Doações e Campanhas por Ano"
        xKey="ano"
        barras={[
                  { chave: "doacoes", cor: "#fca5a5" }, 
                  { chave: "campanhas", cor: "#6ee7b7" },]}
        altura={320}
        icone={<HiTrendingUp />}
      />
    </div>

    <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm">
      <GraficoCircular doadores={doadores} />
    </div>
  </div>






</div>

  );
};

export default Dashboard;
