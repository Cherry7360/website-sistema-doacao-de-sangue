import Doador from "../models/Doador.js";


import Agendamento from "../models/Agendamento.js";
import Campanha from "../models/Campanha.js"
import Doacao from "../models/Doacao.js";

export const obterInfoDashboard = async (req, res) => {
  try {
    const totalDoadores = await Doador.count();

    const totalDoacoes = await Doacao.count({
      where: { estado: "Concluída" },
    });

    const campanhasAtivas = await Campanha.count({
      where: { estado: "true" },
    });

   const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    const dataHoje = `${ano}-${mes}-${dia}`;


    const agendamentosHoje = await Agendamento.count({
      where: {
        estado: "pendente",
        data_agendamento: dataHoje, 
      },
    });

    res.json({
      totalDoadores,
      totalDoacoes,
      campanhasAtivas,
      agendamentosHoje,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter informações do dashboard" });
  }
};
