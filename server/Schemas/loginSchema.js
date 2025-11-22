import { z } from "zod";

export const loginSchema = z.object({
  codigo_usuario: z.string()
    .length(7, "O código deve ter exatamente 7 dígitos")
    .regex(/^\d{7}$/, "O código deve conter apenas números"),
 palavra_passe: z.string()
    .length(7, "A palavra-passe deve ter exatamente 7 dígitos")
    .regex(/^\d{7}$/, "A palavra-passe deve conter apenas números"),
});