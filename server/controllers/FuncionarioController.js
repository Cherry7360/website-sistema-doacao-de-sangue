/**
Retorna informações de um funcionário específico.
Busca o usuário pelo código em req.usuario e seleciona apenas atributos essenciais; retorna 404 se não encontrado.

 */
import Usuario from "../models/Usuario.js";

export const getInfoFuncionario = async (req, res) => {
  try {
    const codigo_usuario = req.usuario.codigo;

    const funcionario = await Usuario.findOne({
      where: { codigo_usuario },
      attributes: ["id_usuario", "nome", "foto", "tipo_usuario", "email"]
    });

    if (!funcionario) {
      return res.status(404).json({ mensagem: "Funcionário não encontrado" });
    }

    res.json(funcionario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar dados do funcionário." });
  }
};

