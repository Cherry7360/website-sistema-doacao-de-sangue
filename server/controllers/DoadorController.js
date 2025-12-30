import bcrypt from "bcrypt";
import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";


import fs from 'fs';
import path from 'path';
import {AtualizarFotoPerfil,AtualizarDadosPerfil, AtualizarPalavraPasseShema } from '../Schemas/userSchema.js';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads/fotos');

import { gerar7Digitos, gerarHash } from "../utils/gerarSenha.js";
import { sendEmail } from "../utils/emailSender.js";
import { sequelize } from "../db.js";
import { registoSchema} from "../Schemas/registoSchema.js"; 



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
};
/*
 Regista um novo doador no sistema.
 Valida dados com Zod, verifica duplicidade de email, gera código e senha temporária, cria registros em Usuario e Doador em transação e envia email de confirmação.
*/
export const RegistarDoador = async (req, res) => {
  const transaction = await sequelize.transaction(); 
const result = registoSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.errors });
}

  try {
    const { nome, morada, cni, email, telefone, tipo_sangue, profissao } = result.data;

    if (!nome || !email || !telefone || !cni || !morada || !tipo_sangue || !profissao) {
      return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
    }

   
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
        tipo_usuario: "doador",
      },
      { transaction }
    );

  
    const novoDoador = await Doador.create(
      {
        codigo_usuario,
        tipo_sangue,
        profissao,
      },
      { transaction }
    );
    const idDoador = novoDoador.id_doador;

    const subject = "Confirmação de Cadastro - Sistema de Doação de Sangue";
    const text = `
        Olá ${nome},

        O seu cadastro foi concluído com sucesso!

        Código de Acesso: ${codigo_usuario}
         Senha Inicial: ${senhaTemporaria}

        Pode aceder ao sistema e alterar a sua senha a qualquer momento.

        Atenciosamente,
        Equipe do Sistema de Doação de Sangue
        `;

   
    await transaction.commit();
    try {
  await sendEmail(email, subject, text);
} catch (emailError) {
  console.error("Falha ao enviar email:", emailError);

}

    res.status(201).json({
      message: "Doador registrado e email enviado com sucesso!",
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

/*Retorna o perfil completo do doador logado.
Busca Doador e inclui dados do Usuario associado; retorna 404 se não encontrado.

 */
export const PerfilDoador = async (req, res) => {
  try {
    const codigo_usuario = req.usuario.codigo; 

    const doador = await Doador.findOne({
      where: { codigo_usuario },
      include: [{
        model: Usuario,
        attributes: ["nome", "email", "cni", "telefone", "morada","foto"]
      }]
    });

    if (!doador) return res.status(404).json({ mensagem: "Doador não encontrado" });

    res.json(doador);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar perfil do doador" });
  }
};

/*
Lista todos os doadores do sistema.
Consulta Doador com atributos essenciais, inclui dados do Usuario e ordena por id; retorna 404 se não houver registros.
 */
export const ListarDoadores = async (req, res) => {
  try {
    const doadores = await Doador.findAll({
      attributes: ["id_doador", "tipo_sangue", "profissao", "data_ultima_doacao"],
      include: [
        {
          model: Usuario,
          attributes: ["nome", "email", "cni", "telefone", "morada", "foto"]
        }
      ],
      order: [["id_doador", "ASC"]]
    });

    if (!doadores || doadores.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum doador encontrado." });
    }

    res.json(doadores);
  } catch (error) {
    console.error("Erro ao listar doadores:", error);
    res.status(500).json({ erro: "Erro ao listar doadores." });
  }
};

/*
Atualiza a foto de perfil de um doador.
Valida a imagem enviada com Zod, apaga arquivo órfão se inválido, e atualiza campo foto no Usuario.
*/
export const AtualizarFotoDoador=async(req,res)=>{
   const dadosComFoto = {
        
  foto: req.file ? `uploads/fotos/${req.file.filename}` : undefined,
};
const result = AtualizarFotoPerfil.safeParse(dadosComFoto);
    if (!result.success) {
    if (req.file) {
            const filePath = path.join(UPLOADS_DIR, req.file.filename); 
            
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("ERRO ao apagar arquivo órfão após validação Zod:", err);
                } else {
                    console.log(`Arquivo órfão apagado com sucesso: ${req.file.filename}`);
                }
            });
        }
      return res.status(400).json({ errors: result.error.errors });
    }
  try{
  const codigo_usuario= req.usuario.codigo;
  const {foto}= result.data
      console.log("req.body:", req.body);  
    console.log("req.file:", req.file); 
    
  await Usuario.update(
      { foto },
      { where: {codigo_usuario } }
    );
    return res.json({
      mensagem: "Foto de perfil atualizada com sucesso",
      foto,
    });
  }catch(error){
        console.error(error);
    res.status(500).json({ mensagem: "Erro " });
  }
}

// Atualiza dados do perfil do doador. Valida dados com Zod e atualiza campos em Usuario e Doador.
export const AtualizarDadosDoador=async(req,res)=>{
  const result = AtualizarDadosPerfil.safeParse(req.body);
  console.log("req.usuario:", req.usuario.codigo);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
   try {
    const codigo_usuario = req.usuario.codigo; 
    const { telefone, email, morada, nome,profissao } = result.data;

 
    await Usuario.update(
      { telefone, email, morada,nome},
      { where: { codigo_usuario } }
    );
     await Doador.update(
      { profissao },
      { where: { codigo_usuario } }
    );

    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }

}
/*
Atualiza a palavra-passe do doador.
Valida dados com Zod, verifica senha atual com bcrypt e salva nova senha criptografada.
*/

export const AtualizarPalavrapasse = async (req, res) => {
  const result =  AtualizarPalavraPasseShema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { palavra_passe_atual, palavra_passe_nova } = result.data;
  const codigo_usuario = req.usuario.codigo;

  try {
    const usuario = await Usuario.findOne({ where: { codigo_usuario } });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(palavra_passe_atual, usuario.palavra_passe);
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: "Palavra-passe atual incorreta." });
    }

    const hashNova = await bcrypt.hash(palavra_passe_nova, 10);

    usuario.palavra_passe = hashNova;
    await usuario.save();

    res.json({ mensagem: "Palavra-passe alterada com sucesso!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao alterar palavra-passe." });
  }
};

