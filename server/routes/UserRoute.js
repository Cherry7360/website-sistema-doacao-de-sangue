import express from "express";
import {getUsuarios,registarFuncionario } from "../controllers/UserController.js";

const router = express.Router();

// rotas do administrador
router.get("/", getUsuarios);
router.post("/registo-usuario",registarFuncionario)

export default router;

