import cron from "node-cron";
import { EnviarLembretesDoacao } from "../controllers/NotificacaoController.js";

cron.schedule("0 8 * * *", async () => {
  console.log("Executando lembretes de doação...");
  await EnviarLembretesDoacao();
}, {
  timezone: "Atlantic/Cape_Verde"
});