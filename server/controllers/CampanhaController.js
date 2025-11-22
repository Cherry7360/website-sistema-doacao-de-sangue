import Campanha from "../models/Campanha.js";
import Funcionario from "../models/Funcionario.js";
import Doador from "../models/Doador.js"

import { campanhaSchema } from '../Schemas/campanhaSchema.js';

import fs from 'fs';
import path from 'path';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads/fotos');

export const criarCampanha = async (req, res) => {

  const dadosComFoto = {
        ...req.body,
       foto: req.file ? req.file.filename : undefined, 
    };
   const result = campanhaSchema.safeParse(dadosComFoto);
    if (!result.success) {
    if (req.file) {
            const filePath = path.join(UPLOADS_DIR, req.file.filename); 
            
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("ERRO ao apagar arquivo órfão após validação Zod:", err);
                } else {
                    console.log(`Arquivo órfão apagado com sucesso: ${req.file.filename}`);
                }
            });
        }
      return res.status(400).json({ errors: result.error.errors });
    }

  try {
    const { descricao, data_campanha,local, estado, horario, foto, id_funcionario } = result.data;
     
     console.log("req.body:", req.body);  
    console.log("req.file:", req.file); 

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
    if (req.file) {
             const filePath = path.join(UPLOADS_DIR, req.file.filename); 
             fs.unlink(filePath, (unlinkErr) => {
                 if (unlinkErr) console.error("Erro ao apagar arquivo órfão após falha no BD:", unlinkErr);
             });
        }
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
  const { id } = req.params; 
  const { estado } = req.body; 

  try {
  
    const campanha = await Campanha.findByPk(id);
    if (!campanha) return res.status(404).json({ message: 'Campanha não encontrada' });

    const funcionario = await Funcionario.findOne({ where: { codigo_usuario: req.usuario.codigo } });
    if (!funcionario) return res.status(403).json({ message: 'Apenas funcionários podem atualizar campanhas' });

    campanha.estado = estado;
    await campanha.save();

    const doadores = await Doador.findAll();
    const notificacoes = doadores.map(doador => ({
      id_doador: doador.id_doador,
      id_funcionario: funcionario.id_funcionario,
      titulo: "Nova Campanha",
      mensagem: `A campanha "${campanha.nome}" está agora ${estado ? "ativa" : "inativa"}.`,
      tipo: "campanha",
      visto: false,
    }));
   

    return res.json({ message: 'Estado atualizado com sucesso', campanha });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar estado' });
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

export const verCampanhas= async(req,res)=>{
    try {
    const campanhas = await Campanha.findAll({
      where: { estado: true }, // só campanhas ativas
      order: [["data_campanha", "DESC"]],
    });

    res.json(campanhas);
  } catch (err) {
    console.error("Erro ao buscar campanhas:", err);
    res.status(500).json({ message: "Erro ao buscar campanhas" });
  }
}

