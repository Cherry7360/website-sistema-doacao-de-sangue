import { sequelize } from "../db.js";
import Usuario from "../models/Usuario.js";
import Funcionario from "../models/Funcionario.js";
import Doador from "../models/Doador.js";
import Notificacao from "../models/Notificacao.js";
import Agendamento from "../models/Agendamento.js"
import Doacao from "../models/Doacao.js"
import {registarUserSchema} from "../Schemas/userSchema.js"
import { gerar7Digitos, gerarHash } from "../utils/gerarSenha.js";
import { emailSender } from "../utils/emailSender.js";

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
export const registarUsuarios = async (req, res) => {
  const transaction = await sequelize.transaction();
  const result = registarUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  try {
    const {nome,morada,cni,email,telefone,genero,tipo_usuario, tipo_sangue, profissao} = result.data;

    // Verifica se o email já existe
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res
        .status(400)
        .json({ message: "Já existe um utilizador registado com este email." });
    }

    const codigo_usuario = await gerarCodigoUsuario();
    const senhaTemporaria = gerar7Digitos();
    const hashSenha = await gerarHash(senhaTemporaria);
    const fotoDefault = "uploads/fotos/default_user.png";

    // Cria o usuário
    const novoUsuario = await Usuario.create(
      {
        codigo_usuario,
        palavra_passe: hashSenha,
        nome,
        morada,
        cni,
        email,
        telefone,
        tipo_usuario,
        genero,
        foto: fotoDefault
      },
      { transaction }
    );

    // Cria o registro específico conforme tipo_usuario
    if (tipo_usuario === "funcionario") {
      await Funcionario.create({ codigo_usuario }, { transaction });
    } else if (tipo_usuario === "doador") {
      await Doador.create(
        { codigo_usuario,
          tipo_sangue,
          profissao,
        },
        { transaction }
      );
    }
    await transaction.commit();

    // Envia email com dados de acesso
    const subject = "Confirmação de Cadastro- Sistema Doe+Vida";
    const text = `
      Olá ${nome},

      O seu cadastro foi concluído com sucesso!

      Código de acesso: ${codigo_usuario}
      Senha inicial: ${senhaTemporaria}

      Pode aceder ao sistema e alterar a sua senha a qualquer momento.

      Atenciosamente,
      Equipe do Sistema Doe+Vida
    `;

    try {
      await emailSender(email, subject, text);
    } catch (emailError) {
      console.error("Falha ao enviar email:", emailError);
    }

    res.status(201).json({
      message: `${tipo_usuario === "doador" ? "Doador" : "Funcionário"} registrado e email enviado com sucesso!`,
      codigo_usuario,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Dados recebidos:", req.body);
    console.error("Erro ao registar usuário:", error.stack);
    res
      .status(500)
      .json({ message: "Erro ao registar usuário. Nenhum dado foi salvo." });
  }
};

/* Retorna a lista de usuários do sistema.
Consulta todos os registos de Usuario selecionando atributos essenciais e ordena por id; retorna 404 se não houver usuários.
*/

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id_usuario","nome", "email", "tipo_usuario","foto"],
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

// Exemplo para o controller de remoção
export const RemoverUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    // Se for doador
    if (usuario.tipo_usuario === "doador") {
      const doador = await Doador.findOne({ where: { codigo_usuario: usuario.codigo_usuario } });

      if (doador) {
       
        await Notificacao.destroy({ where: { id_doador: doador.id_doador } });

        // Se a tabela Doacao tem FK para agendamento, deletar doações primeiro
        const agendamentos = await Agendamento.findAll({ where: { id_doador: doador.id_doador } });

        for (const ag of agendamentos) {
          await Doacao.destroy({ where: { id_agendamento: ag.id_agendamento } }); // remove doações do agendamento
        }


        await Agendamento.destroy({ where: { id_doador: doador.id_doador } });

        
        await doador.destroy();
      }
    }

    // Se for funcionário
    if (usuario.tipo_usuario === "funcionario") {
      const funcionario = await Funcionario.findOne({ where: { codigo_usuario: usuario.codigo_usuario } });
      if (funcionario) {await Notificacao.destroy({ where: { id_funcionario: funcionario.id_funcionario } });

    // Depois deletar o funcionário
    await funcionario.destroy();}};
    

    // Deletar usuário
    await usuario.destroy();

    res.json({ message: "Usuário removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};