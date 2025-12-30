import { Router } from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import {EnviarNotificacao,
ListarNotificacoesDoador, MarcarNotificacaoComoVisto, ListarNotificacoesFuncionario
} from "../controllers/NotificacaoController.js";

const router = Router();

//rotas do doador
router.get("/doador",verifyToken, ListarNotificacoesDoador);
router.put("/visualizada",verifyToken, MarcarNotificacaoComoVisto);

//rotas do funcionario
router.post("/",verifyToken, EnviarNotificacao);
router.get("/funcionario",verifyToken,ListarNotificacoesFuncionario);
export default router;
