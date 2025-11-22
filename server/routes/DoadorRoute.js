import express from "express";

import { verificarToken } from "../middleware/verificarToken.js";
import { listarDoadores,historicoDoacoes,getPerfilDoador} from "../controllers/DoadorController.js";


const router = express.Router();


router.get("/perfil", verificarToken , getPerfilDoador);
router.get("/gerir_doadores", listarDoadores)
router.get("/historico_doacoes", verificarToken,historicoDoacoes)

export default router;
