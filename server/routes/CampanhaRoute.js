import express from "express";
import { criarCampanha, listarCampanhas,atualizarEstado,removerCampanha } from "../controllers/CampanhaController.js";

const router = express.Router();


router.post("/gerir_campanhas", criarCampanha);
router.get("/gerir_campanhas", listarCampanhas);
router.put("/gerir_campanhas/:id", atualizarEstado); 
router.delete("/gerir_campanhas/:id", removerCampanha);

export default router;
