import express from "express";
import { obterInfoDashboard ,getPerfilUsuario} from "../controllers/DashboardController.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", obterInfoDashboard);
router.get("/perfil", verifyToken, getPerfilUsuario);


export default router;
