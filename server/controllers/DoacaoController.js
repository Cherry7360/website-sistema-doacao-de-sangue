import Doacao from "../models/Doacao.js";
import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";
import Funcionario from "../models/Funcionario.js";
import { doacaoSchema} from "../Schemas/doacaoSchema.js"; 

/*
Lista todas as doações com informações do doador e usuário para funcionários.
 Inclui tipo sanguíneo do Doador e nome do Usuário, ordena por data da doação.
 */
export const ListarDoadores= async(req,res)=>{
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

/*
Cria uma nova doação associada a um doador e funcionário.
Valida dados com Zod, verifica existência do doador e do funcionário, define tipo sanguíneo e cria registro no modelo Doacao.
*/
export const CriarDoacao = async (req, res) => {
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

// Remove uma doação específica pelo id.
export const RemoverDoacao = async (req, res) => {
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


/*
 Obtém informações de um doador específico, incluindo tipo sanguíneo, total de doações concluídas e última doação.
Conta doações concluídas e busca a mais recente; retorna 404 se doador não encontrado.
 */
export const ObterInformacaoDoador = async (req, res) => {
    const codigo_usuario = req.usuario.codigo;

  try {

    const doador = await Doador.findOne({ where: { codigo_usuario } });
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

    
    const total_doacoes = await Doacao.count({
      where: {id_doador: doador.id_doador , estado: "Concluída" },
    });

    const ultima_doacao = await Doacao.findOne({
      where: {id_doador: doador.id_doador , estado: "Concluída" },

      order: [["data_doacao", "DESC"]],
    });
    res.json({
      id_doador: doador.id_doador,
      tipo_sangue: doador.tipo_sangue,
      total_doacoes,
      ultima_doacao: ultima_doacao || null,

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter informações do doador" });
  }
};

/*
 Lista o histórico de doações concluídas de um doador logado.
 Busca Doacoes com estado "Concluída", ordenadas por data; retorna 404 se doador não encontrado.
 */
export const HistoricoDoacoesDoador = async (req, res) => {
   const codigo_usuario = req.usuario.codigo; 
  try {
    const doador = await Doador.findOne({
      where: { codigo_usuario },
    });

    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }
    const historico = await Doacao.findAll({
      where: { 
        id_doador: doador.id_doador, 
        estado: "Concluída" 
      },
      order: [["data_doacao", "DESC"]],
      attributes: ["data_doacao", "estado"],
    });
     res.json(historico);

  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ message: "Erro ao listar histórico de doações." });
  }
};

