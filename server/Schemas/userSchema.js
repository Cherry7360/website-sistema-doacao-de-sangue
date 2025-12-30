 import { z } from "zod";

 export const password= z.string()
    .length(7, "A palavra-passe deve ter exatamente 7 dígitos")
    .regex(/^\d{7}$/, "A palavra-passe deve conter apenas números")
 export const telefone= z.string().min(7, "Informe um telefone válido");
  export const email= z.string().email("Email inválido");
 export const profissao= z.string().min(7, "Informe sua profissão");
  export const morada=  z.string().min(4, "Informe sua morada");
 export const nome= z.string().min(10, "O nome deve ter pelo menos 20caracteres");
 export const  foto= z.string() .optional();
export const cni = z.string().max(13,"informe o cni");

 export const tipo_usuario= z.enum(["doador", "funcionario", "admin"], {
    errorMap: () => ({ message: "Tipo de utilizador inválido" }),
  })

export const AtualizarPalavraPasseShema = z.object({
  palavra_passe_atual: z
    .string()
    .min(7, "A palavra-passe atual deve ter 7 dígitos")
    .max(7, "A palavra-passe atual deve ter 7 dígitos")
    .regex(/^\d+$/, "A palavra-passe deve conter apenas números"),

  palavra_passe_nova: z
    .string()
    .min(7, "A nova palavra-passe deve ter 7 dígitos")
    .max(7, "A nova palavra-passe deve ter 7 dígitos")
    .regex(/^\d+$/, "A palavra-passe deve conter apenas números"),

  confirmar: z
    .string()
    .min(7, "Confirmação deve ter 7 dígitos")
    .max(7, "Confirmação deve ter 7 dígitos")
    .regex(/^\d+$/, "A palavra-passe deve conter apenas números"),
})
  .refine((data) => data.palavra_passe_nova === data.confirmar, {
    message: "A confirmação não coincide com a nova palavra-passe",
    path: ["confirmar"],
  })
  .refine((data) => data.palavra_passe_nova !== data.palavra_passe_atual, {
    message: "A nova palavra-passe não pode ser igual à atual",
    path: ["palavra_passe_nova"],
  });


export const AtualizarFotoPerfil=z.object({
  foto
})
export const AtualizarDadosPerfil= z.object({
 telefone,email,profissao,morada,nome
});

export const registarfuncionarioSchema=z.object({
nome,email,telefone,morada,tipo_usuario,cni
})