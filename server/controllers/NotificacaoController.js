import Notificacao from "../models/Notificacao.js";
import Funcionario from "../models/Funcionario.js";
import Doador from "../models/Doador.js";

import  {gerarMensagemNotificacao} from "../utils/gerarMensagemNotificacao.js";
import { notificacaoSchema} from "../Schemas/notificacaoSchema.js"; 


export const listarNotificacoesDoador = async (req, res) => {
  try {
    const codigo = req.usuario.codigo; 
    const doador = await Doador.findOne({ where: { codigo_usuario: codigo } });

    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

    const notificacoes = await Notificacao.findAll({
      where: { id_doador: doador.id_doador },
      order: [["data_envio", "DESC"]],
    });

    const notificacoesFormatadas = notificacoes.map(n => {
      // Dados adicionais usados apenas em notificações automáticas
      const dados = {
        nome: doador.nome,
        data_agendamento: n.data_envio,
        local: n.local,
        data: n.data
      };

      let titulo = n.titulo;
      let mensagem = n.mensagem;

      // Se a notificação NÃO tiver mensagem (automática)
      if (!titulo || !mensagem) {
        const auto = gerarMensagemNotificacao(n.tipo, dados);
        titulo = auto.titulo;
        mensagem = auto.mensagem;
      }

      return {
        id_notificacao: n.id_notificacao,
        tipo: n.tipo,
        visto: n.visto,
        data_envio: n.data_envio,
        titulo,
        mensagem
      };
    });

    res.json(notificacoesFormatadas);

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
   try {
    const codigoUsuario = req.usuario.codigo; // do JWT
    const funcionario = await Funcionario.findOne({ where: { codigo_usuario: codigoUsuario } });

    if (!funcionario) return res.status(404).json({ message: "Funcionário não encontrado." });

    const notificacoes = await Notificacao.findAll({
      where: { id_funcionario: funcionario.id_funcionario },
      order: [["data_envio", "DESC"]]
    });

    res.json(notificacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar notificações." });
  }
};

export const enviarNotificacao = async (req, res) => {
  
  const result = notificacaoSchema.safeParse(req.body);
  
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    console.log("Dados recebidos:",req.body);

  try {
    const { id_doador, mensagem,titulo,tipo } = result.data;
    const codigo_usuario = req.usuario?.codigo;

    if (!id_doador) {
      return res.status(400).json({ message: "Dados incompletos." });
    }

    const funcionario = await Funcionario.findOne({ where: { codigo_usuario } });
    if (!funcionario) return res.status(404).json({ message: "Funcionário não encontrado." });

    const doador = await Doador.findByPk(id_doador);
    if (!doador) return res.status(404).json({ message: "Doador não encontrado." });

   
    
    const novaNotificacao = await Notificacao.create({
      id_doador,
      id_funcionario: funcionario.id_funcionario,
      titulo,
      mensagem,
      tipo,
      visto: false,
    });
 
    res.status(201).json(novaNotificacao);
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
    res.status(500).json({ message: "Erro ao enviar notificação", error: err.message });
  }
};