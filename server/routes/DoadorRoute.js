import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { RegistarDoador,ListarDoadores,PerfilDoador,AtualizarFotoDoador,AtualizarDadosDoador,AtualizarPalavrapasse} from "../controllers/DoadorController.js";
import { upload } from "../middleware/uploadConfig.js";


const router = express.Router();

//rotas do doador
router.post('/', RegistarDoador);
router.get('/meu-perfil', verifyToken , PerfilDoador);
router.get('/', ListarDoadores)
router.post('/meu-perfil/foto',verifyToken,upload.single("foto"),AtualizarFotoDoador);
router.put('/',verifyToken,AtualizarDadosDoador);
router.put('/palavra-passe',verifyToken,AtualizarPalavrapasse);

export default router;
