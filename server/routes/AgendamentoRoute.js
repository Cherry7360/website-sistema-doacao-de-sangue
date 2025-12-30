// routes/agendamentoRoute.js
import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import {
  CriarAgendamento,
  ResponderAgendamento,
  CriarAgendamentoDoador,
  ListarAgendamentos,
  AtualizarEstadoAgendamento,
  RemoverAgendamento,
  HistoricoAgendamentos
} from "../controllers/AgendamentoController.js";

const router = express.Router();

//rotas do funcionario

router.post('/', verifyToken, CriarAgendamento);         
router.get('/', verifyToken, ListarAgendamentos);  
router.put('/', verifyToken, AtualizarEstadoAgendamento);
router.delete("/:id", verifyToken, RemoverAgendamento);  

//rotas do doador
router.post("/doador", verifyToken, CriarAgendamentoDoador);
router.get("/meu-historico", verifyToken, HistoricoAgendamentos);  
router.put("/resposta", verifyToken, ResponderAgendamento);

export default router;

