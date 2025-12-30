import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";

import Agendamento from "../models/Agendamento.js";
import Campanha from "../models/Campanha.js"
import Doacao from "../models/Doacao.js";

/*
Retorna informações resumidas para o dashboard do sistema.
Conta total de doadores, funcionários, doações concluídas, campanhas ativas e agendamentos pendentes do dia.
 */
export const obterInfoDashboard = async (req, res) => {
  try {
    const totalDoadores = await Doador.count();

        const totalFuncionarios = await Usuario.count({
      where: { tipo_usuario: "funcionario" }, 
    });
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
      agendamentosHoje, totalFuncionarios,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter informações do dashboard" });
  }
};

/*
Retorna dados do perfil do usuário logado.
Busca usuário pelo código, retorna atributos essenciais; retorna 404 se não encontrado.
 */
export const getPerfilUsuario = async (req, res) => {
  try {
    const codigo_usuario = req.usuario.codigo; 
    const usuario = await Usuario.findOne({
      where: { codigo_usuario },
      attributes: ["id_usuario", "nome", "foto", "tipo_usuario", "email"]
    });

    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });

   
    res.json(usuario);

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar perfil do usuário." });
  }
};
