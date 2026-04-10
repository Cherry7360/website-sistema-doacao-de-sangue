import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import {EnviarNotificacao,
ListarNotificacoesDoador, MarcarNotificacaoComoVisto, ListarNotificacoesFuncionario
,notificarEstoqueCritico } from "../controllers/NotificacaoController.js";
const router = express.Router();

//rotas do doador
router.get("/doador",verifyToken, ListarNotificacoesDoador);
router.put("/visualizada",verifyToken, MarcarNotificacaoComoVisto);

//rotas do funcionario
router.post("/",verifyToken, EnviarNotificacao);
router.get("/funcionario",verifyToken,ListarNotificacoesFuncionario);
router.post("/estoque-critico",verifyToken, notificarEstoqueCritico);


export default router;
