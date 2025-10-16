import Usuario from "../models/Usuario.js";
import { gerar7Digitos, gerarHash } from "../utils/gerarSenha.js";
//import { sendEmail } from "../utils/emailSender.js";

export const registarDoador = async (req, res) => {
  try {
    const { nome, cni, email, telefone, morada } = req.body;

    const password = gerar7Digitos();
    const codigo_usuario = gerar7Digitos();
    const palavra_passe = await gerarHash(password);

    const usuario = await Usuario.create({
      nome, email, cni, telefone, morada,
      tipo_usuario: 'doador',
      palavra_passe,
      codigo_usuario
    });

    await sendEmail(
      email,
      "Dados de Acesso - Sistema de Doação de Sangue",
      `Olá ${nome},\n\nSeu registo foi concluído!\nCódigo: ${codigo_usuario}\nSenha: ${password}`
    );

    res.json({ mensagem: "Doador registado com sucesso", usuario, codigo_usuario, password });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao registar doador" });
  }
};
