import express from "express";
import {verificarToken} from "../middleware/verificarToken.js";
import {getInfoFuncionario} from "../controllers/FuncionarioController.js";

const router = express.Router();

router.get("/funcionario",verificarToken,getInfoFuncionario);

export default router;