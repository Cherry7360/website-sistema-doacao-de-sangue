import Estoque from "../models/Estoque.js";
import Funcionario from "../models/Funcionario.js";
import Doacao from "../models/Doacao.js";
import Doador from "../models/Doador.js";
import { estoqueSchema} from "../Schemas/estoqueSchema.js"; 


/* Calcula o total de sangue disponível por tipo, somando entradas e saídas,
 e define o estado do estoque (crítico, atenção ou ok) com base na quantidade.

*/
export const TotalEstoquePorTipo = async (req, res) => {
  try {
    const tipos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const totais = {};

    for (const tipo of tipos) {
      // soma entradas
      const entradas = await Estoque.sum("quantidade_ml", {
        where: { tipo_sangue: tipo, movimento: "entrada" }
      }) || 0;

      // soma saídas
      const saidas = await Estoque.sum("quantidade_ml", {
        where: { tipo_sangue: tipo, movimento: "saida" }
      }) || 0;

      const estoqueAtual = entradas - saidas;

      // definir status
      let status;
      if (estoqueAtual < 900) status = "critico";
      else if (estoqueAtual <= 1500) status = "atencao";
      else status = "ok";

      totais[tipo] = {
        quantidade: estoqueAtual,
        status,
      };
    }

    res.json({ totais });
    console.log("estoque:", { totais })

  } catch (err) {
    console.error("Erro ao calcular total de sangue:", err);
    res.status(500).json({ error: "Erro ao calcular total de sangue" });
  }
};

/*Lista todos os registos de estoque de sangue existentes na base de dados,
retornando informações detalhadas como tipo, quantidade e movimentação.

*/
export const ListarEstoque = async (req, res) => {
  try {
    const estoque = await Estoque.findAll({
      attributes: ["id_estoque",
        "tipo_sangue",
        "quantidade_ml",
        "utilidade",
        "observacao",
        "data_utilizacao",
        "id_funcionario",
        "id_doacao","movimento","observacao"
      ],
      order: [["id_estoque", "ASC"]]
    });

    res.json(estoque);
  } catch (err) {
    console.error("Erro ao listar estoque:", err);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
};

/*Adiciona um novo registo ao estoque de sangue (entrada ou saída),
validando dados, verificando existência de funcionário, doação e doador,
e associando automaticamente o tipo de sangue do doador.

*/
export const AdicionarEstoque = async (req, res) => {
  try {
    // Validar o body
    const result = estoqueSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    //Pegar os dados validados
    const {
      id_funcionario,
      id_doacao,
      quantidade_ml,
      data_utilizacao,
      utilidade,
      movimento,
      observacao,
    } = result.data;

    // Verificar se o funcionário existe
    const funcionario = await Funcionario.findByPk(id_funcionario);
    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    //  Verificar se a doação existe
    const doacao = await Doacao.findByPk(id_doacao);
    if (!doacao) {
      return res.status(404).json({ message: "Doação não encontrada" });
    }
const doador = await Doador.findByPk(doacao.id_doador);
if (!doador) {
  return res.status(404).json({ message: "Doador não encontrado" });}
   
    const novoEstoque = await Estoque.create({
      id_funcionario,
      id_doacao,
      tipo_sangue: doador.tipo_sangue, 
      quantidade_ml,
      data_utilizacao,
      utilidade,
      movimento,
      observacao,
    });

    return res.status(201).json(novoEstoque);

  } catch (err) {
    console.error("Erro ao adicionar estoque:", err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

/*Remove um registo específico do estoque de sangue 
*/
export const RemoverEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Estoque.destroy({ where: { id_estoque: id } });

    if (!deleted) return res.status(404).json({ error: "Item do estoque não encontrado" });

    res.json({ message: "Item removido do estoque com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar item do estoque:", err);
    res.status(500).json({ error: "Erro interno ao deletar do estoque" });
  }
};
