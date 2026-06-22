import { controllerManutencao } from "../controllers/manutencao.controller.js";
import { protegerPagina } from "../middleware/auth.js";

import express from 'express';

const router = express.Router();

router.get('/', protegerPagina, controllerManutencao.telaManutencao);

router.post('/', controllerManutencao.listarManutencoes);

router.post('/adicionar', controllerManutencao.criarManutencao);

router.post('/procurar', controllerManutencao.procurarManutencao);

router.post('/listar', controllerManutencao.listarManutencoes);

router.post('/deletar', controllerManutencao.deletarManutencao);

router.put('/atualizar', controllerManutencao.atualizarManutencao);

export default router;
