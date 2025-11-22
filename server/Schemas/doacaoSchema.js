import { z } from "zod";

export const id_doador = z.preprocess((val) => {
  if (typeof val === "string") return Number(val);
  return val;
}, z.number({
  required_error: "Informe o ID do doador",
  invalid_type_error: "ID do doador deve ser um número",
}));

export const descricao = z.string().optional();

export const estado = z.string({
  required_error: "O estado da doação é obrigatório"
});



export const data_doacao = z
    .string()
  .refine((val) => {
    const [ano, mes, dia] = val.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    return diaSemana !== 0 && diaSemana !== 6;
  }, "data de doacao invalida",{required_error:" invalido"});

export const doacaoSchema = z.object({
  id_doador,
  estado, 
  descricao,
  data_doacao
});
