import { z } from "zod";

export const registoSchema = z.object({
  nome: z.string().min(10, "O nome deve ter pelo menos 20caracteres"),
  cni: z.string().length(13, "O CNI deve ter exatamente 13 dígitos"),
  telefone: z.string().min(7, "Informe um telefone válido"),
  email: z.string().email("Email inválido"),
  profissao: z.string().min(7, "Informe sua profissão"),
  morada: z.string().min(4, "Informe sua morada"),
  tipo_sangue: z.string().min(2, "Informe seu tipo sanguíneo"),
     peso: z.number().min(30, "Informe um peso válido").max(300, "Peso muito alto"),
  altura: z.number().min(50, "Informe uma altura válida").max(250, "Altura muito alta"),

  ultimaDoacao: z.string().min(10, "Informe a última doação").optional(), 
  doencas: z.string().min(1, "Informe doenças ou medicamentos"),
});
