// estoqueSchema.js
import { z } from "zod";

// Transformar string em número para campos numéricos
export const id_funcionario = z.preprocess(
  (val) => (val === "" ? undefined : Number(val)),
  z.number({
    required_error: "Informe o ID do funcionário",
    invalid_type_error: "ID do funcionário deve ser um número",
  })
);

export const id_doacao = z.preprocess(
  (val) => (val === "" ? undefined : Number(val)),
  z.number({
    required_error: "Informe o ID da doação",
    invalid_type_error: "ID da doação deve ser um número",
  })
);

const quantidade_ml = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number({
    required_error: "Informe a quantidade em ml",
    invalid_type_error: "Quantidade deve ser um número",
  })
);

// Data de utilização válida
const data_utilizacao = z
  .string({
    required_error: "Informe a data da utilização",
  })
  .refine((val) => {
    if (!val) return false;
    const [ano, mes, dia] = val.split("-").map(Number);
    const date = new Date(ano, mes - 1, dia);
    return !isNaN(date.getTime()); // valida se é uma data válida
  }, "Data de utilização inválida");

// Movimento: entrada ou saída
export const movimento = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.enum(["entrada", "saida"], {
    required_error: "Selecione o movimento",
  })
);

const utilidade = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.enum(
    ["transfusao", "cirurgia", "emergencia","doacao", "tratamento", "outro"],
    {
      required_error: "Selecione a utilidade",
      invalid_type_error: "Utilidade inválida",
    }
  )
);

// Observação: opcional
const observacao = z.string().optional();



// Schema completo
export const estoqueSchema = z.object({
  id_funcionario,
  movimento,
  quantidade_ml,
  utilidade,
  data_utilizacao,
  observacao,
  id_doacao
});