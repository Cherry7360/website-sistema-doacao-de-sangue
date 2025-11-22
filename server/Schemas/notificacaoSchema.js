import { z } from "zod";

export const id_doador = z.preprocess(val => {
  if (typeof val === "string") return Number(val);
  return val;
}, z.number({
  required_error: "Informe o ID do doador",
  invalid_type_error: "ID do doador deve ser um número",
}));

export const titulo = z.string({ required_error: "O título é obrigatório." })
  .min(3, "O título não pode ficar vazio.");

export const mensagem = z.string({ required_error: "A mensagem é obrigatória." })
  .min(3, "A mensagem não pode ficar vazia.");

export const tipo = z.enum(["agendamento", "campanha", "urgente", "resposta", "geral"], {
  required_error: "O tipo de notificação é obrigatório.",
});

export const notificacaoSchema = z.object({
 id_doador,
  titulo,
  mensagem,
  tipo
});