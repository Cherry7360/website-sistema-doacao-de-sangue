import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";
import Doacao from "../models/Doacao.js";

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


export const listarDoadores = async (req, res) => {
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

export const historicoDoacoes= async(req,res)=>{
   try {
    const codigo_usuario = req.usuario.codigo; 

    const doador = await Doador.findOne({ where: { codigo_usuario } });
       
       if (!doador) {
     
      return res.status(404).json({ message: "Doador não encontrado." });
    }
const historico = await Doacao.findAll({
      where: { id_doador: doador.id_doador, estado: "Concluída" },
      order: [
        ["data_doacao", "DESC"]
      ], attributes: ["data_doacao", "estado"] 
   
    });
      console.log("Histórico encontrado:", historico);
    res.json(historico);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar histórico de agendamentos" });
  }
};
