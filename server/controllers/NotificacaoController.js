import Notificacao from "../models/Notificacao.js";
import Funcionario from "../models/Funcionario.js";
import Doador from "../models/Doador.js";


import { notificacaoSchema} from "../Schemas/notificacaoSchema.js"; 

/* Lista todas as notificações de um doador específico.
 Busca o doador pelo código em req.usuario, consulta Notificacao associadas ao id_doador, ordena por data/hora e formata a resposta.
*/
export const ListarNotificacoesDoador = async (req, res) => {
  try {
    const codigo = req.usuario.codigo; 

    const doador = await Doador.findOne({ where: { codigo_usuario: codigo } });
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

  
   const notificacoes = await Notificacao.findAll({
    where: { id_doador: doador.id_doador },
    order: [["data_envio", "DESC"], ["hora_envio", "DESC"]] });

    const notificacoesFormatadas = notificacoes.map(n => ({
      id_notificacao: n.id_notificacao,
      titulo: n.titulo,
      mensagem: n.mensagem,
      data_envio: n.data_envio,
      hora_envio:n.hora_envio,
      visto:n.visto,
      tipo: n.tipo,
    }));

    res.json(notificacoesFormatadas);

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar notificações" });
  }
};

/* Marca uma notificação como vista/lida.
Recebe id_notificacao no body, busca a notificação e atualiza o campo visto para true.
 */
export const MarcarNotificacaoComoVisto = async (req, res) => {
   

     const id_notificacao = req.body.id_notificacao; 
  console.log("ID back  recebido:", id_notificacao);
  try {
    const notif = await Notificacao.findByPk(id_notificacao);

    if (!notif) return res.status(404).json({ mensagem: "Notificação não encontrada" });
   
      await Notificacao.update(
      { visto: true },
      { where: { id_notificacao: id_notificacao } }
    );
    res.json({ mensagem: "Notificação marcada como lida" });
    } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao atualizar notificação" });
  }
};


// Lista todas as notificações enviadas por um funcionário.

export const ListarNotificacoesFuncionario = async (req, res) => {
   try {
    const codigo_usuario = req.usuario.codigo; 
    const funcionario = await Funcionario.findOne({ where: { codigo_usuario } });

    if (!funcionario) return res.status(404).json({ message: "Funcionário não encontrado." });

    const notificacoes = await Notificacao.findAll({
      where: { id_funcionario: funcionario.id_funcionario },
      order: [["data_envio", "DESC"], ["hora_envio", "DESC"]]
    });

    res.json(notificacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar notificações." });
  }
};

/*Envia uma nova notificação de um funcionário para um doador.
 Valida dados com Zod, busca funcionario e doador, define data/hora de envio e cria registro no modelo Notificacao.
 */
export const EnviarNotificacao = async (req, res) => {
  
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

    const now = new Date();
    const dataEnvio = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const horaAtual = now.toTimeString().slice(0,5); 

    
    const novaNotificacao = await Notificacao.create({
      id_doador,
      id_funcionario: funcionario.id_funcionario,
      titulo,
      mensagem,
       hora_envio:horaAtual,
      visto: false,
      data_envio: dataEnvio,
      tipo,
    
    });
 
    res.status(201).json(novaNotificacao);
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
    res.status(500).json({ message: "Erro ao enviar notificação", error: err.message });
  }
};