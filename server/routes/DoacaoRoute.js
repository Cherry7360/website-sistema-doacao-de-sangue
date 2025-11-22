import express from "express";
import { getDoacoes,adicionarDoacao,removerDoacao} from "../controllers/DoacaoController.js";
import {verificarToken} from "../middleware/verificarToken.js";

const router = express.Router();

router.get("/gerir_doacoes",verificarToken, getDoacoes);
router.post("/gerir_doacoes", verificarToken,adicionarDoacao);
router.delete("/gerir_doacoes/:id",removerDoacao);
//router.put("/gerir_doacoes/:id",verificarToken,atualizarDoacao);


export default router;
