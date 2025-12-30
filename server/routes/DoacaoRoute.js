import express from "express";
import { ListarDoadores,CriarDoacao,RemoverDoacao,HistoricoDoacoesDoador,ObterInformacaoDoador} from "../controllers/DoacaoController.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();
// rotas do funcionario 
router.get("/",verifyToken, ListarDoadores);
router.post("/", verifyToken,CriarDoacao);
router.delete("/:id",RemoverDoacao);
//rotas do doador
router.get("/doador/historico-doador",verifyToken,HistoricoDoacoesDoador);
router.get("/doador/informacao-doador", verifyToken,ObterInformacaoDoador);

export default router;
