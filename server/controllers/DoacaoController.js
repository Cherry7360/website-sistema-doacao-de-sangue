import Doacao from "../models/Doacao.js";
import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";
import Funcionario from "../models/Funcionario.js";
import { doacaoSchema} from "../Schemas/doacaoSchema.js"; 


export const getDoacoes= async(req,res)=>{
   try {
    const doacoes = await Doacao.findAll({
      include: [
        { model: Doador,
          attributes: ["tipo_sangue"],
          include: [ {model: Usuario, attributes: ["nome"], },],
        },
      ], attributes: ["id_doacao", "data_doacao", "estado"],
       order: [["data_doacao", "DESC"]],
   
    });


    res.json(doacoes);
  } catch (err) {
    console.error("Erro ao listar doações:", err);
    res.status(500).json({ error: "Erro ao buscar doações" });
  }
}



export const adicionarDoacao = async (req, res) => {
  const result = doacaoSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  try {
    const { id_doador, descricao,data_doacao, estado } = result.data; 
    const codigo_usuario = req.usuario.codigo;

    if (!id_doador) return res.status(400).json({ error: "ID do doador é obrigatório" });

     const doador = await Doador.findByPk(id_doador, {
      attributes: ["tipo_sangue"] 
    });
    if (!doador) return res.status(400).json({ error: "Doador não encontrado" });

    const funcionario = await Funcionario.findOne({ where: { codigo_usuario } });
    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

 


    const novaDoacao = await Doacao.create({
      id_doador,
      id_funcionario: funcionario.id_funcionario,
      descricao: descricao || null,
      tipo_sangue:doador.tipo_sangue,
      estado: estado || "Pendente",
      data_doacao,
    });

    return res.status(201).json(novaDoacao);

  } catch (error) {
    console.error("Erro ao criar doação:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};


export const removerDoacao = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Doacao.destroy({ where: { id_doacao: id } });

    if (!deleted) return res.status(404).json({ error: "Doação não encontrada" });

    res.json({ message: "Doação eliminada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar doação:", err);
    res.status(500).json({ error: "Erro interno ao deletar doação" });
  }
};


      /*export const atualizarDoacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const doacao = await Doacao.findByPk(id);
    if (!doacao) return res.status(404).json({ error: "Doação não encontrada" });

    doacao.estado = estado || doacao.estado;
    await doacao.save();

    res.json(doacao);
  } catch (err) {
    console.error("Erro ao atualizar doação:", err);
    res.status(500).json({ error: "Erro interno ao atualizar doação" });
  }
};*/