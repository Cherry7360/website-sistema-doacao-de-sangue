import { z } from "zod";

export const campanhaSchema = z.object({
  descricao: z
    .string({ required_error: "A descrição é obrigatória." })
    .min(5, "A descrição deve ter pelo menos 5 caracteres."),
   

  data_campanha: z
    .string({ required_error: "A data da campanha é obrigatória." })
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida."),

  horario: z
    .string({ required_error: "O horário é obrigatório." })
    .min(3, "Horário inválido."),

  local: z
    .string({ required_error: "O local é obrigatório." })
    .min(2, "O local deve ter pelo menos 2 caracteres."),

  foto: z
    .string()
    .url("A foto deve ser um link válido.")
    .optional(),

  id_funcionario: z.preprocess((val) => {

  if (typeof val === "string") return Number(val);
  return val;
}, z.number({
  required_error: "Informe o ID do doador",
  invalid_type_error: "ID do doador deve ser um número",}))

});
