
import Usuario from "../models/Usuario.js";
import Doador from "../models/Doador.js";

import Notificacao from "../models/Notificacao.js";
import Agendamento from "../models/Agendamento.js";
import Funcionario from "../models/Funcionario.js";

import { gerarMensagemNotificacao } from "../utils/gerarMensagemNotificacao.js";
import { agendamentoFuncionarioSchema ,agendamentoDoadorSchema} from "../Schemas/agendamentoSchema.js"; 


/*
Cria um agendamento feito pelo doador.
Valida dados do corpo da requisição com Zod, cria o agendamento e envia notificações para todos os funcionários.
 */
export const CriarAgendamentoDoador = async (req, res) => {
  const result = agendamentoDoadorSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  try {
    const { data_agendamento, horario, obs, local_doacao } = result.data;
    const codigo_usuario = req.usuario.codigo;

    if (!data_agendamento || !horario) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

    const doador = await Doador.findOne({ where: { codigo_usuario } });
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

    const novoAgendamento = await Agendamento.create({
      id_doador: doador.id_doador,
      id_funcionario: null,
      data_agendamento,
      horario,
      obs,
      local_doacao,
      estado: "pendente",
    });

   
    const funcionarios = await Funcionario.findAll();


    const { titulo, mensagem } = gerarMensagemNotificacao("novo_agendamento", {
      tipoDestinatario: "funcionario",
      data_agendamento,
      horario,
      local_doacao,
    });

   
    for (const func of funcionarios) {
      await Notificacao.create({
        id_funcionario: func.id_funcionario,
        id_doador: doador.id_doador,
        titulo,
        mensagem,
        tipo: "novo_agendamento",
        visto: false,
        data_envio: new Date(),
      });
    }

    res.status(201).json({
      message: "Agendamento criado com sucesso.",
      agendamento: novoAgendamento,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar agendamento", error });
  }
};


/*
Cria um agendamento feito pelo funcionário para um doador específico.
 Valida dados com Zod, cria o agendamento e envia notificação para o doador.
 */

export const CriarAgendamento = async (req, res) => {
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
      estado: "aguardando_resposta", 
    });

  const { titulo, mensagem } = gerarMensagemNotificacao("novo_agendamento", {
   tipoDestinatario: "doador", 
    data_agendamento,
  horario,
  local_doacao
});

   const novaNotificacao= await Notificacao.create({
      id_funcionario: funcionario.id_funcionario,
      id_doador: doador.id_doador,
      titulo,
      mensagem,
      tipo: "novo_agendamento",
      visto: false,
      data_envio: new Date(),
    });
    console.log("Notificação criada:", novaNotificacao.toJSON());
console.log("Mensagem de notificação:", titulo, mensagem);

    res.status(201).json({
      message: "Agendamento criado com sucesso. ",
      agendamento: novoAgendamento,
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// Lista todos os agendamentos, incluindo informações do doador e do usuário associado.

export const ListarAgendamentos = async (req, res) => {
  try {
   

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

/*
Atualiza o estado de um agendamento (aceite, rejeitado, etc.)
Valida funcionário logado, altera o estado e envia notificação ao doador.
 */
export const AtualizarEstadoAgendamento = async (req, res) => {
  try {
    const { id_agendamento, estado } = req.body;
    const codigo_usuario = req.usuario.codigo;

    if (!id_agendamento || !estado) {
      return res.status(400).json({ message: "Campos obrigatórios em falta (id_agendamento ou estado)." });
    }

  
    const funcionario = await Funcionario.findOne({ where: { codigo_usuario} });
    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }

  
    const agendamento = await Agendamento.findByPk(id_agendamento, {
      include: [Doador] 
    });
    if (!agendamento) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

  agendamento.estado = estado;
    agendamento.id_funcionario = funcionario.id_funcionario;
    await agendamento.save();

    const doador = agendamento.Doador;
    if (!doador) return res.status(404).json({ message: "Doador não encontrado." });

   
    let tipoNotificacao;
    if (estado === "aceite") tipoNotificacao = "agendamento_aceite";
    else if (estado === "rejeitado") tipoNotificacao = "agendamento_recusado";
    else tipoNotificacao = "atualizacao_agendamento";

  
    const { titulo, mensagem } = gerarMensagemNotificacao(tipoNotificacao, {
    
      data_agendamento: agendamento.data_agendamento,
      local_doacao: agendamento.local_doacao,
      horario:agendamento.horario,
    });

    const now = new Date();
    const dataEnvio = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const horaAtual = now.toTimeString().slice(0,5); 

  console.log("hora:", dataEnvio)
    await Notificacao.create({
      id_doador: agendamento.id_doador,
      id_funcionario: funcionario.id_funcionario,
      titulo,
      mensagem,
      tipo: tipoNotificacao,
      hora_envio:horaAtual,
      visto: false,
      data_envio: dataEnvio,
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
// Remove um agendamento pelo ID.
export const RemoverAgendamento = async (req, res) => {
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

// Lista o histórico de agendamentos de um doador, incluindo o próximo agendamento pendente ou confirmado.

export const  HistoricoAgendamentos= async (req,res)=>{

const codigo_usuario = req.usuario.codigo 

  try {
    
     const doador = await Doador.findOne({ where: { codigo_usuario } });
    if (!doador) return res.status(404).json({ mensagem: "Doador não encontrado" });

    const id_doador = doador.id_doador;
    const agendamentos = await Agendamento.findAll({
      where: { id_doador },
      order: [["data_agendamento", "DESC"], ["horario", "DESC"]]
    });

     const proximo = agendamentos
      .filter(a => a.estado === "pendente" || a.estado === "confirmado")
     
    res.json({
      historico: agendamentos,
      proximo: proximo[0] || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar histórico de agendamentos" });
  };
};
// Permite ao doador ou funcionário responder a um agendamento, alterando seu estado.

export const ResponderAgendamento = async (req, res) => {
  try {
    const { id_agendamento, estado } = req.body;

    console.log("dados",req.body)
    const agendamento = await Agendamento.findByPk(id_agendamento);
    if (!agendamento) return res.status(404).json({ mensagem: "Agendamento não encontrado" });

    agendamento.estado = estado;
    await agendamento.save();

    res.json({ mensagem: "Agendamento atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao atualizar agendamento" });
  }
};


