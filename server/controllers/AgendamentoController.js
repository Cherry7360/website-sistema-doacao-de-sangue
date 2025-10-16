// controllers/agendamentoController.js
import { Agendamento } from "../models/Agendamento.js";
import Funcionario from "../models/Funcionario.js";
import Usuario from "../models/Usuario.js";
import Doador from "../models/Doador.js";
import { Op } from "sequelize";

export const criarAgendamentoDoador = async (req, res) => {
  const {  data_agendamento, horario, obs } = req.body;
  
    const id_doador = req.usuario.id;
  if (!id_doador || !data_agendamento || !horario) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  try {
    const novo = await Agendamento.create({
      id_doador,
      id_funcionario: null,  // FK do funcionário fica null inicialmente
      data_agendamento,
      horario,
      obs,
      estado: "pendente"
    });

    res.status(201).json({ message: "Agendamento criado", agendamento: novo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar agendamento" });
  }
};

 export const historicoAgendamentosDoador = async (req, res) => {
  try {
     const id_doador = req.usuario.id;

    // Buscar apenas agendamentos realizados
    const historico = await Agendamento.findAll({
      where: {
        id_doador
      },
      order: [
        ["data_agendamento", "DESC"], // do mais recente para o mais antigo
        ["horario", "DESC"]
      ],
    });

    res.json(historico);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar histórico de agendamentos" });
  }
};

export const obterInfoDoador = async (req, res) => {
  const id_doador = req.usuario.id;

  try {
    const doador = await Doador.findByPk(id_doador);

    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado" });
    }

    // contar total de doações realizadas
    const total_doacoes = await Agendamento.count({
      where: { id_doador: id_doador, estado: "confirmado" },
    });

    // buscar última doação realizada
    const ultima_doacao = await Agendamento.findOne({
      where: { id_doador: id_doador, estado: "confirmado" },
      order: [["data_agendamento", "DESC"], ["horario", "DESC"]],
    });

    // buscar próximo agendamento futuro
    const proximoAgendamento = await Agendamento.findOne({
      where: {
        id_doador,
        estado: "pendente",
        data_agendamento: { [Op.gte]: new Date() }, // só datas futuras ou hoje
      },
      order: [["data_agendamento", "ASC"], ["horario", "ASC"]], // mais próximo primeiro
    });

    res.json({
      id_doador: doador.id_doador,
      tipo_sangue: doador.tipo_sangue,
      total_doacoes,
      ultima_doacao: ultima_doacao || null,
      proximo_agendamento: proximoAgendamento  || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter informações do doador" });
  }
};


export const criarAgendamento = async (req, res) => {
  try {
    const { id_doador,  data_agendamento, horario, obs } = req.body;
    const id_funcionario= req.usuario.id

    const novoAgendamento = await Agendamento.create({
      id_doador,
      id_funcionario,
      data_agendamento,
      horario,
      obs,
      estado: "pendente",
    });

    res.status(201).json(novoAgendamento);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const listarAgendamentos = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    const agendamentos = await Agendamento.findAll({
      where: {
        estado: "pendente",
        data_agendamento: { [Op.lte]: hoje },
      },
      include: [
        {
          model: Doador,
          include: [
            {
              model: Usuario,
              attributes: ["nome"], 
            },
          ],
        },
      ],
      order: [["data_agendamento", "ASC"], ["horario", "ASC"]],
    });

    res.json(agendamentos);
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res.status(500).json({ message: "Erro ao listar agendamentos" });
  }
};