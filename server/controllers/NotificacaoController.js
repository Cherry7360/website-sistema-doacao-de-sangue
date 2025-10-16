import Notificacao from "../models/Notificacao.js";
import Funcionario from "../models/Funcionario.js";

export const listarNotificacoesDoador = async (req, res) => {
  try {
    const id_doador = req.usuario.id; // vem do middleware

    const notificacoes = await Notificacao.findAll({
      where: { id_doador },
      order: [["data_envio", "DESC"]], // mais recentes primeiro
    });

    res.json(notificacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar notificações" });
  }
};


export const marcarNotificacaoComoVisto = async (req, res) => {
  try {
    const { id_notificacao } = req.params;

    const notif = await Notificacao.findByPk(id_notificacao);
    if (!notif) return res.status(404).json({ mensagem: "Notificação não encontrada" });

    notif.visto = true;
    await notif.save();

    res.json({ mensagem: "Notificação marcada como lida", notificacao: notif });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao atualizar notificação" });
  }
};

export const getNotificacoesFuncionario = async (req, res) => {
   const id_funcionario= req.usuario.id  
  try {
    const notificacoes = await Notificacao.findAll({
      where: { id_funcionario },
      order: [["data_envio", "DESC"]],
    });
    res.json(notificacoes);
  } catch (err) {
    console.error("Erro ao buscar notificações:", err);
    res.status(500).json({ error: "Erro ao buscar notificações" });
  }
};

export const enviarNotificacaoFuncionario = async (req, res) => {
  try {
    const { id_doador, mensagem } = req.body;
    const codigo_usuario = req.usuario?.codigo 

    if (!id_doador || !mensagem) {
      return res.status(400).json({ message: "Dados incompletos." });
    }

    
    const funcionario = await Funcionario.findOne({
      where: { codigo_usuario },
    });

    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }

    const id_funcionario = funcionario.id_funcionario;

    const novaNotificacao = await Notificacao.create({
      id_doador,
      id_funcionario,
      mensagem,
      visto: false,
    });

    res.status(201).json(novaNotificacao);
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
    res
      .status(500)
      .json({ message: "Erro ao enviar notificação", error: err.message });
  }
};