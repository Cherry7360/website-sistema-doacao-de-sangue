export function gerarMensagemNotificacao(tipo, dados = {}) {


  switch (tipo) {
  case "novo_agendamento":
  return {
    titulo: "Novo Agendamento",
    mensagem:
      dados.tipoDestinatario === "funcionario"
        ? `Um novo agendamento criado : ${dados.data_agendamento} às ${dados.horario || ""} no local ${dados.local_doacao}.`
        : `Tem um novo pedido de agendamento. Clique para ver os detalhes.`
       
  };


    case "agendamento_aceite":
      return {
        titulo: "Agendamento Aceite",
        mensagem: `O seu agendamento foi confirmado para dia ${dados.data_agendamento} as ${dados.horario || ""} no local ${dados.local_doacao}.`,
      };

    case "agendamento_recusado":
      return {
        titulo: "Agendamento Recusado",
        mensagem: `O seu agendamento para dia ${dados.data_agendamento} foi recusado. Dirija-se ao balcão de atendimento.`,
      };

    case "atualizacao_agendamento":
      return {
        titulo: "Atualização do Agendamento",
        mensagem: `O estado do seu agendamento para dia ${dados.data_agendamento} no local ${dados.local_doacao} foi atualizado.`,
      };

    case "campanha":
      return {
        titulo: "Nova Campanha de Doação",
        mensagem: `Uma nova campanha foi lançada em ${dados.local || "local não especificado"}! Data: ${dados.data || "brevemente"}.`,
      };

    default:
      return {
        titulo: "Notificação",
        mensagem: "Tens uma nova atualização.",
      };
  }
}
 /*`Foi criado um novo agendamento para você no dia ${dados.data_agendamento} às ${dados.horario || ""} no local ${dados.local_doacao}.`, */