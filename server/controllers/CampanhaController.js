import Campanha from "../models/Campanha.js";


export const criarCampanha = async (req, res) => {
  try {
    const { descricao, data_campanha,local, estado, horario, foto, id_funcionario } = req.body;

    const campanha = await Campanha.create({
      descricao,
      data_campanha,
      horario,
      foto,
      estado,
      local,  
      id_funcionario,
    });

    res.status(201).json(campanha);
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    res.status(500).json({ error: "Erro ao criar campanha" });
  }
};

export const listarCampanhas = async (req, res) => {
  try {
    const campanhas = await Campanha.findAll({
      order: [["data_campanha", "ASC"]],
      include: ["Funcionario"] // opcional, se quiseres mostrar info do funcionário
    });
    res.json(campanhas);
  } catch (error) {
    console.error("Erro ao listar campanhas:", error);
    res.status(500).json({ error: "Erro ao listar campanhas" });
  }
};

export const atualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const campanha = await Campanha.findByPk(id);
    if (!campanha) return res.status(404).json({ error: "Campanha não encontrada" });

    campanha.estado = estado;
    await campanha.save();

    res.json({ message: "Estado atualizado com sucesso", campanha });
  } catch (error) {
    console.error("Erro ao atualizar estado:", error);
    res.status(500).json({ error: "Erro ao atualizar estado" });
  }
};

export const removerCampanha = async (req, res) => {
  try {
    const { id } = req.params;

    const campanha = await Campanha.findByPk(id);
    if (!campanha) return res.status(404).json({ error: "Campanha não encontrada" });

    await campanha.destroy();
    res.json({ message: "Campanha removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover campanha:", error);
    res.status(500).json({ error: "Erro ao remover campanha" });
  }
};

