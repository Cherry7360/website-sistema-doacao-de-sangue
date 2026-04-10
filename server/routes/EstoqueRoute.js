import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import {ListarEstoque,AdicionarEstoque,TotalEstoquePorTipo,RemoverEstoque} from "../controllers/EstoqueController.js"

const router = express.Router();


router.get("/",verifyToken,ListarEstoque);
router.get("/total", TotalEstoquePorTipo);
router.post("/", verifyToken,AdicionarEstoque);
router.delete("/:id",RemoverEstoque);

export default router;