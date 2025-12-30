import express from "express";
import { CriarCampanha,VerCampanhas, ListarCampanhas,AtualizarEstadoCampanha,RemoverCampanha } from "../controllers/CampanhaController.js";
import {verifyToken} from "../middleware/verifyToken.js";
import { upload } from "../middleware/uploadConfig.js";

const router = express.Router();


//rotas do funcionario
router.post("/",verifyToken, upload.single("foto"),CriarCampanha);
router.get("/", ListarCampanhas);
router.put("/:id",verifyToken, AtualizarEstadoCampanha); 
router.delete("/:id",verifyToken, RemoverCampanha);

//rotas do doador
router.get("/doador",VerCampanhas);
export default router;

