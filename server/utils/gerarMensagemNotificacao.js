export function gerarMensagemNotificacao(tipo, dados={}) {
   switch (tipo) {
    case "novo_agendamento":
      
      const data = new Date(dados.data_agendamento);
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const ano = data.getFullYear();

      
      const horario = dados.horario || "";
      
      return {
          titulo: "Novo Agendamento",
        mensagem: dados.tipoDestinatario === "funcionario"
          ? `Você tem um novo agendamento marcado para dia ${dia}/${mes}/${ano} às ${horario} no local ${dados.local_doacao}.`
          : `Um doador  criou um novo agendamento.`,
      };
 

    case "agendamento_aceite":
      return {
        titulo: "Agendamento Aceite",
        mensagem: `O seu agendamento confirmado para dia ${dados.data_agendamento} no local${dados.local_doacao}.`,
      };
    case "agendamento_recusado":
      return {
        titulo: "Agendamento Recusado",
        mensagem: `O seu agendamento  para dia ${dados.data_agendamento} foi recusado. Dirige-te ao balcão de atendimento.`,
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
