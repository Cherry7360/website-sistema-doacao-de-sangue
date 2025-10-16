// routes/agendamentoRoute.js
import express from "express";
import {verificarToken} from "../middleware/verificarToken.js";
import {
  criarAgendamento,
  criarAgendamentoDoador,historicoAgendamentosDoador
  ,obterInfoDoador,listarAgendamentos
} from "../controllers/AgendamentoController.js";

const router = express.Router();

// CRUD do funcionário
router.post("/gerir",verificarToken, criarAgendamento);         // criar
router.get("/",verificarToken, listarAgendamentos);  
//router.put("/gerir_agendamentos/:id",verificarToken, atualizarAgendamento);
//router.delete("/gerir_agendamentos/:id",verificarToken, removerAgendamento);  // remover

// CRUD do doador
router.post("/agendar_doador",verificarToken,criarAgendamentoDoador);
router.get("/historico",verificarToken,historicoAgendamentosDoador);
router.get("/info_doador", verificarToken,obterInfoDoador);
export default router;
