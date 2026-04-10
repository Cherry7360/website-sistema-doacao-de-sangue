
// Função responsável por gerar o conteúdo (título e mensagem) das notificações
// com base no tipo de evento e nos dados recebidos do sistema.

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

    case "lembrete_doacao":
     
      let saudacao = "Lembrete";
      if (dados.genero === "Feminino") saudacao = "Olá senhora";
      else if (dados.genero === "Masculino") saudacao = "Olá senhor";

      return {
        titulo: "Lembrete de Doação",
        mensagem: `${saudacao} ${dados.nome}, você tem uma doação amanhã às ${dados.horario} no local ${dados.local_doacao}.`,
      };


    case "estoque_estado_critico":
        return {
          titulo: "Urgente: Doação de Sangue Necessária",
          mensagem: `Prezado(a) ${dados.nome},

      O tipo de sangue ${dados.tipo_sangue} encontra-se em estado crítico no nosso banco de sangue.

      A sua ajuda pode salvar vidas. Se possível, dirija-se ao banco de sangue.

      Atenciosamente,
      Banco de Sangue`
        };

    default:
      return {
        titulo: "Notificação",
        mensagem: "Tens uma nova atualização.",
      };
  }
}
