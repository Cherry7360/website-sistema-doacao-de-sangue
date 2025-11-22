import express from "express";
import { obterInfoDashboard } from "../controllers/DashController.js";

const router = express.Router();
router.get("/", obterInfoDashboard);


export default router;
