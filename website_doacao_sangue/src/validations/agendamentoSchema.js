
import { z } from "zod";
//Schemas de validação de agendamentos usando Zod.Uso: validação de formulários antes de enviar dados ao backend, garantindo consistência de tipos e regras de negócio.

export const data_agendamento = z
  .string()
  .nonempty("Informe a data do agendamento")
  .refine((val) => {
    const [ano, mes, dia] = val.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    return diaSemana !== 0 && diaSemana !== 6;
  }, "Não é possível agendar aos fins de semana");

export const horario = z
  .string()
  .nonempty("Informe o horário")
  .refine((val) => {
    const [hora] = val.split(":").map(Number);
    return hora >= 8 && hora < 15;
  }, "Horário deve ser entre 08:00 e 15:00");

export const local_doacao = z.string().nonempty("Selecione o local da doação");

export const obs = z.string().optional();


export const id_doador = z.preprocess((val) => {

  if (typeof val === "string") return Number(val);
  return val;
}, z.number({
  required_error: "Informe o ID do doador",
  invalid_type_error: "ID do doador deve ser um número",
}));

export const agendamentoFuncionarioSchema = z.object({
  id_doador,
  data_agendamento,
  horario,
  local_doacao,
  obs,
});

export const agendamentoDoadorSchema = z.object({
  data_agendamento,
  horario,
  local_doacao,
  obs,
});