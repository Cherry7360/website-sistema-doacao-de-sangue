import { Router } from "express";
import {verificarToken} from "../middleware/verificarToken.js";
import {enviarNotificacaoFuncionario,
listarNotificacoesDoador, marcarNotificacaoComoVisto
} from "../controllers/NotificacaoController.js";

const router = Router();

router.get("/",verificarToken, listarNotificacoesDoador);
router.put("/visto/:id_notificacao",verificarToken, marcarNotificacaoComoVisto);
router.post("/gerir_notificacoes",verificarToken, enviarNotificacaoFuncionario);
export default router;
