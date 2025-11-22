import { Router } from "express";
import {verificarToken} from "../middleware/verificarToken.js";
import {enviarNotificacao,
listarNotificacoesDoador, marcarNotificacaoComoVisto, getNotificacoesFuncionario
} from "../controllers/NotificacaoController.js";

const router = Router();

router.get("/",verificarToken, listarNotificacoesDoador);
router.put("/visto/:id_notificacao",verificarToken, marcarNotificacaoComoVisto);
router.post("/gerir_notificacoes",verificarToken, enviarNotificacao);
router.get("/gerir_notificacoes",verificarToken,getNotificacoesFuncionario);
export default router;
