import express from "express";
import { criarCampanha,verCampanhas, listarCampanhas,atualizarEstado,removerCampanha } from "../controllers/CampanhaController.js";
import {verificarToken} from "../middleware/verificarToken.js";
import { upload } from "../middleware/uploadConfig.js";

const router = express.Router();



router.post("/gerir_campanhas",verificarToken, upload.single("foto"),criarCampanha);
router.get("/gerir_campanhas", listarCampanhas);
router.put("/gerir_campanhas/:id",verificarToken, atualizarEstado); 
router.delete("/gerir_campanhas/:id",verificarToken, removerCampanha);

router.get("/doador",verCampanhas);
export default router;
