
import Usuario from "../models/Usuario.js";
import Doador from "../models/Doador.js";
import { Op } from "sequelize";
import Notificacao from "../models/Notificacao.js";
import Agendamento from "../models/Agendamento.js";
import Funcionario from "../models/Funcionario.js";
import Doacao from "../models/Doacao.js";
import { gerarMensagemNotificacao } from "../utils/gerarMensagemNotificacao.js";
import { agendamentoFuncionarioSchema ,agendamentoDoadorSchema} from "../Schemas/agendamentoSchema.js"; // ou .ts se usar TS


export const criarAgendamentoDoador = async (req, res) => {
 const result = agendamentoDoadorSchema.safeParse(req.body);

if (!result.success) {
  return res.status(400).json({ errors: result.error.errors });
}

  try {
     const { data_agendamento, horario, obs, local_doacao } = result.data;

    const codigo_usuario=req.usuario.codigo  

    if (!data_agendamento || !horario) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

 
    const doador = await Doador.findOne({ where: {  codigo_usuario } });
    if (!doador) {
      return res.status(404).json({ message: "doador não encontrado." });
   
    }

    const novoAgendamento = await Agendamento.create({
      id_doador: doador.id_doador,   
      id_funcionario: null,
      data_agendamento,
      horario,
      obs,
      local_doacao: local_doacao ,
      estado: "pendente",
    });

   const funcionarios = await Funcionario.findAll();

  const { titulo, mensagem } = gerarMensagemNotificacao("novo_agendamento", {});

    await Promise.all(
      funcionarios.map((f) =>
        Notificacao.create({
          id_funcionario: f.id_funcionario,
          id_doador: doador.id_doador,
          titulo,
          mensagem,
          tipo: "novo_agendamento", data_envio: new Date(),
          id_agendamento: novoAgendamento.id_agendamento,
        })
      )
    );
  

    res.status(201).json({
      message: "Agendamento criado com sucesso.",
      agendamento: novoAgendamento,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar agendamento", error });
  }
};

 export const historicoAgendamentosDoador = async (req, res) => {
  try {
    const codigo_usuario = req.usuario.codigo; 

    const doador = await Doador.findOne({ where: { codigo_usuario } });
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }
    const historico = await Agendamento.findAll({
      where: { id_doador: doador.id_doador },
      order: [
        ["data_agendamento", "DESC"],
        ["horario", "DESC"],["local_doacao", "DESC"]
      ],
    });

    res.json(historico);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar histórico de agendamentos" });
  }
};

export const obterInfoDoador = async (req, res) => {
    const codigo_usuario = req.usuario.codigo;

  try {

    const doador = await Doador.findOne({ where: { codigo_usuario } });
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

    
    const total_doacoes = await Doacao.count({
      where: {id_doador: doador.id_doador , estado: "Concluída" },
    });

   
    const ultima_doacao = await Doacao.findOne({
      where: {id_doador: doador.id_doador , estado: "Concluída" },

      order: [["data_doacao", "DESC"]],
    });


    const proximoAgendamento = await Agendamento.findOne({
      where: {
        id_doador: doador.id_doador ,
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
 const result = agendamentoFuncionarioSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  try {

    const { id_doador, data_agendamento, horario, obs, local_doacao } = result.data;
    const codigo_usuario= req.usuario.codigo
   
    const doador = await Doador.findByPk(id_doador);
    const funcionario = await Funcionario.findOne({where: {codigo_usuario}});

    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }
    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }

    const novoAgendamento = await Agendamento.create({
      id_doador,
      id_funcionario:funcionario.id_funcionario,
      data_agendamento,
      horario,
      local_doacao,
      obs,
      estado: "pendente",
    });

  const { titulo, mensagem } = gerarMensagemNotificacao("novo_agendamento", {
  data_agendamento,
  horario,
  local_doacao
});

    await Notificacao.create({
      id_funcionario: funcionario.id_funcionario,
      id_doador: doador.id_doador,
      titulo,
      mensagem,
      tipo: "novo_agendamento",
      visto: false,
      data_envio: new Date(),
    });

    res.status(201).json({
      message: "Agendamento criado com sucesso. ",
      agendamento: novoAgendamento,
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};


export const listarAgendamentos = async (req, res) => {
  try {
   // const hoje = new Date();
   // hoje.setHours(23, 59, 59, 999);

    const agendamentos = await Agendamento.findAll({
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
      order: [["data_agendamento", "DESC"], ["horario", "DESC"],  ['estado', 'ASC']],
    });

    res.json(agendamentos);
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res.status(500).json({ message: "Erro ao listar agendamentos" });
  }
};

export const AtualizarEstado = async (req, res) => {
  try {
    const { id_agendamento, estado ,data_agendamento,local_doacao} = req.body;
    const  codigo = String(req.usuario.codigo);

  
    if (!id_agendamento || !estado) {
      return res.status(400).json({ message: "Campos obrigatórios em falta (id_agendamento ou novo_estado)." });
    }


    const funcionario = await Funcionario.findOne({ where: {codigo_usuario:codigo} });
    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }

    const agendamento = await Agendamento.findByPk(id_agendamento);
    if (!agendamento) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }


    agendamento.estado = estado;
    agendamento.id_funcionario = funcionario.id_funcionario;
    agendamento.data_agendamento= data_agendamento

    await agendamento.save();

     const doador = await Doador.findByPk(agendamento.id_doador);
    if (!doador) return res.status(404).json({ message: "Doador não encontrado." });

   
        let tipoNotificacao;
    if (estado === "aceitar") tipoNotificacao = "agendamento_aceite";
    else if (estado === "rejeitar" ) tipoNotificacao = "agendamento_recusado";
    else tipoNotificacao = "atualizacao_agendamento";

   const { titulo, mensagem } = gerarMensagemNotificacao(tipoNotificacao, {
        nome: doador.nome,
        data_agendamento: agendamento.data_agendamento,
        local_doacao: agendamento.local_doacao,
       
      });
        
    await Notificacao.create({
      id_doador: agendamento.id_doador,
      id_funcionario: funcionario.id_funcionario,
      titulo,
      mensagem,
      tipo: tipoNotificacao,
      visto: false,
      data_envio: new Date(),
    });

    res.status(200).json({
      message: `Estado do agendamento atualizado para "${estado}".`,
      agendamento,
    });

  } catch (error) {
    console.error("Erro ao atualizar estado do agendamento:", error);
    res.status(500).json({ message: "Erro interno ao atualizar estado do agendamento", error: error.message });
  }
};

export const removerAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Agendamento.destroy({ where: { id_agendamento: id } });

    if (!deleted) return res.status(404).json({ error: "nao encontrado" });

    res.json({ message: "Agenda eliminada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar agenda:", err);
    res.status(500).json({ error: "Erro interno agenda" });
  }
};
