import express from "express";
import { getPerfilDoador } from "../controllers/DoadorController.js";
import { verificarToken } from "../middleware/verificarToken.js";
//import { listarDoadores} from "../controllers/DoadoresController.js";


const router = express.Router();


router.get("/perfil", verificarToken , getPerfilDoador);
//router.get("/gerir_doador", listarDoadores)

export default router;
