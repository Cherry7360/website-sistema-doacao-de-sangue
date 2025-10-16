import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";

export const getPerfilDoador = async (req, res) => {
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
