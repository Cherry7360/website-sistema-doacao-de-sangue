import express from "express";
import {getUsuarios,registarUsuarios,RemoverUsuario } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// rotas do administrador
router.get("/", getUsuarios);
router.post("/registo-usuario",registarUsuarios)
router.delete("/:id",verifyToken, RemoverUsuario);
export default router;

