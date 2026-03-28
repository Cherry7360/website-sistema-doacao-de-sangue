import { z } from "zod";
//Schemas de validação de agendamentos usando Zod.Uso: validação de formulários antes de enviar dados ao backend, garantindo consistência de tipos e regras de negócio.


export const loginSchema = z.object({
  codigo: z.string()
    .length(7, "O código deve ter exatamente 7 dígitos")
    .regex(/^\d{7}$/, "O código deve conter apenas números"),

  password: z.string()
    .length(7, "A palavra-passe deve ter exatamente 7 dígitos")
    .regex(/^\d{7}$/, "A palavra-passe deve conter apenas números"),
});
