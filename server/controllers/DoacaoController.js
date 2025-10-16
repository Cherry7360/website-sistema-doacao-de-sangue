import Doacao from "../models/Doacao.js";
import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";

export const getDoacoes= async(req,res)=>{
   try {
    const doacoes = await Doacao.findAll({
      include: [
        { model: Doador,
          attributes: ["tipo_sangue"],
          include: [ {model: Usuario, attributes: ["nome"], },],
        },
      ], attributes: ["id_doacao", "data_doacao", "estado"],
    });

    const resultado = doacoes.map((d) => ({
      id_doacao: d.id_doacao,
      nome: d.Doador?.Usuario?.nome || "Não encontrado",
      tipo_sangue:d.Doador?.tipo_sangue, 
      data_doacao: d.data_doacao,
      estado: d.estado
    }));

    res.json(resultado);
  } catch (err) {
    console.error("Erro ao listar doações:", err);
    res.status(500).json({ error: "Erro ao buscar doações" });
  }
}
export const adicionarDoacao = async (req, res) => {
  try {
    const { id_doador, descricao, data_doacao, estado, id_funcionario } = req.body;

    if (!id_doador) return res.status(400).json({ error: "id_doador é obrigatório" });

    const doador = await Doador.findByPk(id_doador);
    if (!doador) return res.status(400).json({ error: "Doador não encontrado" });

    const payload = { id_doador, descricao: descricao || null };

    if (id_funcionario) payload.id_funcionario = id_funcionario;
    if (data_doacao) payload.data_doacao = new Date(data_doacao);
    if (estado) payload.estado = estado;

    const novaDoacao = await Doacao.create(payload);
    return res.status(201).json(novaDoacao);
  } catch (err) {
    console.error("Erro ao adicionar doação:", err);
    return res.status(500).json({ error: "Erro interno ao adicionar doação" });
  }
};
export const atualizarDoacao = async (req, res) => {
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