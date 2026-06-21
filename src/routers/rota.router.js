import { controllerRota } from "../controllers/rota.controller.js";
import { protegerPagina } from "../middleware/auth.js";
import express from 'express';

const router = express.Router();

router.get('/', controllerRota.telaRota);

router.post('/', controllerRota.listarRotas);

router.post('/adicionar', controllerRota.criarRota);

router.post('/procurar', controllerRota.procurarRota);

router.post('/listar', controllerRota.listarRotas);

router.post('/deletar', controllerRota.deletarRota);

router.put('/atualizar', controllerRota.atualizarRota);

export default router;
