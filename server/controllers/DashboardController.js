import Doador from "../models/Doador.js";
import Usuario from "../models/Usuario.js";

import Agendamento from "../models/Agendamento.js";
import Campanha from "../models/Campanha.js"
import Doacao from "../models/Doacao.js";

/*
Retorna informações resumidas para o dashboard do sistema.
Conta total de doadores, funcionários, doações concluídas, campanhas ativas e agendamentos pendentes do dia.
 */

export const obterInfoDashboard = async (req, res) => {
  try {
   
    const totalDoadores = await Doador.count();
    const totalFuncionarios = await Usuario.count({ where: { tipo_usuario: "funcionario" } });
   
   const Totalmasculino = await Doador.count({
      include: [{
        model: Usuario,
        where: { genero: 'Masculino' }
      }]
    });

    const Totalfeminino = await Doador.count({
      include: [{
        model: Usuario,
        where: { genero: 'Feminino' }
      }]
    });

    
    // Pegar todas as doações concluídas
 const doacoes = await Doacao.findAll({
      where: { estado: "Concluído" },
      include: [
        {
          model: Doador,
          attributes: ["tipo_sangue"]
        }
      ]
    });
 
    // Agrupar por ano
    const doacoesPorAno = doacoes.reduce((acc, item) => {
      const ano = new Date(item.data_doacao).getFullYear();
      const existente = acc.find(e => e.ano === ano);
      if (existente) existente.total++;
      else acc.push({ ano, total: 1 });
      return acc;
    }, []).sort((a, b) => a.ano - b.ano);

    // Pegar todas as campanhas
    const campanhas = await Campanha.findAll({ raw: true });
    // Agrupar por ano
    const campanhasPorAno = campanhas.reduce((acc, item) => {
      const ano = new Date(item.data_campanha).getFullYear();
      const existente = acc.find(e => e.ano === ano);
      if (existente) existente.total++;
      else acc.push({ ano, total: 1 });
      return acc;
    }, []).sort((a, b) => a.ano - b.ano);


const campanhasAtivas = await Campanha.count({
  where: { estado: "true" }
});
   

    res.json({
      totalDoadores,
      
      totalFuncionarios,
      doacoesPorAno,
      campanhasPorAno,
      Totalfeminino,
      Totalmasculino, campanhasAtivas
   
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter informações do dashboard" });
  }
};


/*
Retorna dados do perfil do usuário logado.
Busca usuário pelo código, retorna atributos essenciais; retorna 404 se não encontrado.
 */
export const getPerfilUsuario = async (req, res) => {
  try {
    const codigo_usuario = req.usuario.codigo; 
    const usuario = await Usuario.findOne({
      where: { codigo_usuario },
      attributes: ["id_usuario", "nome", "foto", "tipo_usuario", "email"]
    });

    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });

   
    res.json(usuario);

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar perfil do usuário." });
  }
};




