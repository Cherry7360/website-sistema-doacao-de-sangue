import { sequelize } from "../db.js";
import Usuario from "../models/Usuario.js";
import Funcionario from "../models/Funcionario.js";

import {registarfuncionarioSchema} from "../Schemas/userSchema.js"
import { gerar7Digitos, gerarHash } from "../utils/gerarSenha.js";
import { sendEmail } from "../utils/emailSender.js";

// Gera um novo código único para o usuário.
const gerarCodigoUsuario = async () => {
  const ultimo = await Usuario.findOne({
    order: [["codigo_usuario", "DESC"]],
  });
  let novoCodigo = 70000001;
  if (ultimo) {
    novoCodigo = parseInt(ultimo.codigo_usuario) + 1;
  }
  return novoCodigo.toString();
}

/* Regista um novo funcionário no sistema.
Valida os dados com Zod, verifica duplicidade de email, gera código e senha temporária, cria registros nas tabelas Usuario e Funcionario em transação e envia email de confirmação.
Depende de sequelize.transaction(), modelos Usuario e Funcionario, utilitários gerar7Digitos, gerarHash e sendEmail.
*/
export const registarFuncionario= async(req,res)=>{

    const transaction = await sequelize.transaction(); 
    const result = registarfuncionarioSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

  try {
    const { nome, morada, cni, email, telefone, tipo_usuario} = result.data;

   
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ message: "Já existe um utilizador registado com este email." });
    }

    const codigo_usuario = await gerarCodigoUsuario();
    const senhaTemporaria = gerar7Digitos();
    const hashSenha = await gerarHash(senhaTemporaria);

    const novoUsuario = await Usuario.create(
      {
        codigo_usuario,
        palavra_passe: hashSenha,
        nome,
        morada,
        cni,
        email,
        telefone,
        tipo_usuario: "funcionario",
      },
      { transaction }
    );

  
    const novofuncionario = await Funcionario.create(
      {
        codigo_usuario,
      },
      { transaction }
    );
  

    const subject = "Confirmação de Cadastro - Sistema Doe+Vida";
    const text = `
        Olá ${nome},

        O seu cadastro foi concluído com sucesso!

        Código de Acesso: ${codigo_usuario}
         Senha Inicial: ${senhaTemporaria}

        Pode aceder ao sistema e alterar a sua senha a qualquer momento.

        Atenciosamente,
        Equipe do Sistema Doe+Vida
        `;

   
    await transaction.commit();
    try {
  await sendEmail(email, subject, text);
} catch (emailError) {
  console.error("Falha ao enviar email:", emailError);

}

    res.status(201).json({
      message: "Funcionario registrado e email enviado com sucesso!",
      codigo_usuario,
    });
  } catch (error) {

    console.log("Dados recebidos:", req.body);
    await transaction.rollback();
     console.error(error.stack); 
    console.error("Erro ao registrar doador:", error);
    res.status(500).json({ message: "Erro ao registrar doador. Nenhum dado foi salvo." });
  }
};

/* Retorna a lista de usuários do sistema.
Consulta todos os registos de Usuario selecionando atributos essenciais e ordena por id; retorna 404 se não houver usuários.
*/

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["nome", "email", "tipo_usuario","foto"],
      order: [["id_usuario", "ASC"]], 
    });

    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum usuário encontrado." });
    }

    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuarios:", error);
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
};

