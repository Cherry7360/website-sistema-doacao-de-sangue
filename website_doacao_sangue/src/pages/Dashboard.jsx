import { HiOutlineUsers, HiOutlineHeart, HiOutlineSpeakerphone, HiOutlineCalendar } from "react-icons/hi";

import { useEffect, useState } from "react";
import axios from "axios";

const base = "http://localhost:5080/dash";

const Dashboard = () => {
  const [dados, setDados] = useState({
    totalDoadores: 0,
    totalDoacoes: 0,
    campanhasAtivas: 0,
    agendamentosHoje: 0,
  });

  const [infoDash, setInfoDash] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(base);
      setDados({
        totalDoadores: res.data.totalDoadores,
        totalDoacoes: res.data.totalDoacoes,
        campanhasAtivas: res.data.campanhasAtivas,
        agendamentosHoje: res.data.agendamentosHoje,
      });
      setInfoDash(res.data.infoExtra || null);
      console.log("Dashboard carregado.");
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard", err);
    }
  };

  const cards = [
    { title: "Total de Doadores", value: dados.totalDoadores, icon: <HiOutlineUsers size={28} className="text-white" />, bg: "bg-blue-500" },
    { title: "Total de Doações", value: dados.totalDoacoes, icon: <HiOutlineHeart size={28} className="text-white" />, bg: "bg-red-500" },
    { title: "Campanhas Ativas", value: dados.campanhasAtivas, icon: <HiOutlineSpeakerphone size={28} className="text-white" />, bg: "bg-yellow-500" },
    { title: "Agendamentos pendentes Hoje", value: dados.agendamentosHoje, icon: <HiOutlineCalendar size={28} className="text-white" />, bg: "bg-green-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`flex items-center p-6 rounded-xl shadow-lg ${card.bg} text-white transition-transform hover:scale-105`}
          >
            <div className="p-4 rounded-full bg-white/20 mr-4">
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm opacity-80">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

    
    </div>
  );
};

export default Dashboard;
