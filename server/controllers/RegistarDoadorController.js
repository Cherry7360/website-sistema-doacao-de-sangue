import Usuario from "../models/Usuario.js";
import Doador from "../models/Doador.js";
import Notificacao from "../models/Notificacao.js";
import { gerar7Digitos, gerarHash } from "../utils/gerarSenha.js";
import { sendEmail } from "../utils/emailSender.js";
import { sequelize } from "../db.js";//  importa a instância principal do Sequelize
import { registoSchema} from "../Schemas/registoSchema.js"; // ou .ts se usar TS



// Função para gerar próximo código de usuário
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

export const registarDoador = async (req, res) => {
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

    await sendEmail(email, subject, text);



   
    await transaction.commit();

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
/**
 * 
 * v    await Notificacao.create(
      {
        codigo_usuario,
        mensagem: `Olá ${nome}, o seu cadastro foi concluído com sucesso. 
        O seu código de acesso é **${codigo_usuario}** 
        e a sua senha inicial é **${senhaTemporaria}**. 
        Pode alterá-la a qualquer momento no seu perfil.`,
        data_envio: new Date(),
        lida: false,
      },
      { transaction }
    );
 */