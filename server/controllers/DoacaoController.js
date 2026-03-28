import Doacao from "../models/Doacao.js";
import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";
import Funcionario from "../models/Funcionario.js";
import Agendamento from "../models/Agendamento.js"
import { doacaoSchema} from "../Schemas/doacaoSchema.js"; 

/*
Lista todas as doações com informações do doador e usuário para funcionários.
 Inclui tipo sanguíneo do Doador e nome do Usuário, ordena por data da doação.
 */
export const ListarDoacoes= async(req,res)=>{
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
    const { id_doador, descricao, data_doacao, estado, id_agendamento } = result.data; 
    const codigo_usuario = req.usuario.codigo;

    // Verifica se o doador existe
    const doador = await Doador.findByPk(id_doador, {
      attributes: ["tipo_sangue"]
    });
    if (!doador) return res.status(400).json({ error: "Doador não encontrado" });

    // Verifica se o funcionário existe
    const funcionario = await Funcionario.findOne({ where: { codigo_usuario } });
    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    // Busca o agendamento
    const agendamento = await Agendamento.findByPk(id_agendamento);
    if (!agendamento) return res.status(400).json({ error: "Agendamento não encontrado" });

    // Garante que data_agendamento seja um Date
    const dataAgendamento = agendamento.data_agendamento instanceof Date
      ? agendamento.data_agendamento
      : new Date(agendamento.data_agendamento);

    // Compara as datas no formato YYYY-MM-DD
    const dataDoacaoStr = new Date(data_doacao).toISOString().slice(0, 10);
    const dataAgendamentoStr = dataAgendamento.toISOString().slice(0, 10);

    if (dataDoacaoStr !== dataAgendamentoStr) {
      return res.status(400).json({ error: "A data da doação deve ser igual à data do agendamento" });
    }

    // Cria a doação
    const novaDoacao = await Doacao.create({
      id_doador,
      id_funcionario: funcionario.id_funcionario,
      descricao: descricao || null,
      estado: estado || "-",
      data_doacao: dataDoacaoStr,
      id_agendamento
    });

      await Doador.update(
      { data_ultima_doacao: dataDoacaoStr },
      { where: { id_doador } }
    );
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
 Obtém informações de um doador específico, incluindo tipo sanguíneo, total de doações concluídas , última doação e estimativa de quando doar denovo.
Conta doações concluídas e busca a mais recente; retorna 404 se doador não encontrado.
 */
export const ObterInformacaoDoador = async (req, res) => {
  const codigo_usuario = req.usuario.codigo;

  try {
    // Busca doador com gênero
    const doador = await Doador.findOne({
      where: { codigo_usuario },
      include: [{ model: Usuario, attributes: ["genero"] }],
    });

    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

    // Total de doações concluídas
    const total_doacoes = await Doacao.count({
      where: { id_doador: doador.id_doador, estado: "Concluído" },
    });

    // Última doação concluída
    const ultimaDoacaoRegistro = await Doacao.findOne({
      where: { id_doador: doador.id_doador, estado: "Concluído" },
      order: [["data_doacao", "DESC"]],
    });

    const ultima_doacao = ultimaDoacaoRegistro?.data_doacao || null;

    // Próxima doação e status
    let proxima_doacao = null;
    let status_doacao = null;      // "aguardando", "urgente", "disponivel", "primeira"
    let diasDesdeProxima = null;   // contador de dias para exibir no frontend

    if (!ultima_doacao) {
      // Nunca doou → primeira doação
      proxima_doacao = null;
      status_doacao = "primeira";
      diasDesdeProxima = null;
    } else {
      // Já doou → calcula próxima data com base no sexo
      const genero = doador.Usuario?.genero;
      const diasIntervalo = genero === "Feminino" ? 120 : 90;

      const hoje = new Date();
      const dataUltima = new Date(ultima_doacao);

      // Normaliza para evitar bug de timezone
      hoje.setHours(0, 0, 0, 0);
      dataUltima.setHours(0, 0, 0, 0);

      const diffDias = Math.floor((hoje - dataUltima) / (1000 * 60 * 60 * 24));

      let ciclosNecessarios;
      if (diffDias < diasIntervalo) {
        ciclosNecessarios = 1;
      } else {
        ciclosNecessarios = Math.floor(diffDias / diasIntervalo) + 1;
      }

      const dataProxima = new Date(dataUltima);
      dataProxima.setDate(dataProxima.getDate() + ciclosNecessarios * diasIntervalo);

      proxima_doacao = dataProxima.toISOString().slice(0, 10);

      const diffParaHoje = Math.floor((hoje - dataProxima) / (1000 * 60 * 60 * 24));

      if (diffParaHoje < 0) {
        status_doacao = "Aguardando ";             // Próxima ainda não chegou
        diasDesdeProxima = Math.abs(diffParaHoje);
      } else if (diffParaHoje === 0) {
        status_doacao = "Urgente";                // Hoje pode doar
        diasDesdeProxima = 0;
      } else {
        status_doacao = "Disponivel";             // Já passou → apto para doar
        diasDesdeProxima = diffParaHoje;
      }
    }

    res.json({
      id_doador: doador.id_doador,
      genero: doador.Usuario?.genero,
      tipo_sangue: doador.tipo_sangue,
      total_doacoes,
      ultima_doacao,
      proxima_doacao,
      status_doacao,
      diasDesdeProxima,
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
   
    const doador = await Doador.findOne({ where: { codigo_usuario } });

    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

   const historico = await Doacao.findAll({
      where: {
        id_doador: doador.id_doador,
        estado: "Concluído",
      },
      order: [["data_doacao", "DESC"]],
      attributes: ["data_doacao", "estado"],
      include: [
        {
          model: Agendamento,
          attributes: ["local_doacao"],
          required: false, 
        },
      ],
    });

  
    const historicoFormatado = historico.map((item) => ({
      data_doacao: item.data_doacao,
      estado: item.estado,
      local_doacao: item.Agendamento?.local_doacao || "Local não informado",
    }));

    res.json(historicoFormatado);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ message: "Erro ao listar histórico de doações." });
  }
};

