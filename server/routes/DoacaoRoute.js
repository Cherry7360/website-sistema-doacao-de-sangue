import express from "express";
import { getDoacoes,adicionarDoacao,atualizarDoacao,removerDoacao} from "../controllers/DoacaoController.js";

const router = express.Router();

router.get("/gerir_doacoes", getDoacoes);
router.post("/gerir_doacoes", adicionarDoacao);
router.delete("/gerir_doacoes/:id",removerDoacao);
router.put("/gerir_doacoes/:id",atualizarDoacao);


export default router;
