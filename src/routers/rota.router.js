import { controllerRota } from "../controllers/rota.controller.js";
import express from "express"

const router = express.Router();

router.post('/criar',controllerRota.criarRota);

router.get('/listar',controllerRota.listarRotas);

router.put('/atualizar',controllerRota.atualizarRota);

router.post('/buscar',controllerRota.buscarRota);

router.post('/deletar',controllerRota.deletarRota);

export default router;