//import bcrypt from "bcryptjs";
import client_bd from '../db.js';

import { gerar7Digitos, gerarHash } from "../utils/gerarSenha.js";

import { sendEmail } from "../utils/emailSender.js";


const registarDoador = async (req,res) => {
  try {
    const {
      nome,
      cni,
      email,
      telefone,
      morada } = req.body;

   
    const password = gerar7Digitos();     
    const codigo_usuario = gerar7Digitos();   
    console.log("Password gerada:", password);
    console.log("Código de usuário gerado:", codigo_usuario);
    const palavra_passe = await gerarHash(password);


    const result = await client_bd.query(
      `INSERT INTO usuarios ( nome,email,cni,telefone, morada, tipo_usuario,palavra_passe,codigo_usuario)VALUES ($1,$2,$3,$4,$5,'doador',$6,$7) RETURNING *`,
      [nome,email,cni,telefone, morada,palavra_passe,codigo_usuario]
    );

    await sendEmail(
          email,
          "Dados de Acesso - Sistema de Doação de Sangue",
          `Olá ${nome},seja bemvindo ao nosso website\n\n O seu registo foi concluído com sucesso.\n\nCódigo de Usuário: ${codigo_usuario}\nSenha: ${password}\n\nUse estes dados para fazer login no sistema.`
        );



    res.json({
          mensagem: "Doador registado com sucesso",
          usuario: result.rows[0],  // retorna todos os dados que ficaram no BD
          codigo_usuario:codigo_usuario,
          password:password
        });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao registar doador" });
  }
};
export { registarDoador };