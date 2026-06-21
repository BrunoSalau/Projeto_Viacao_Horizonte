import { controllerAbastecimento } from "../controllers/abastecimento.controller.js";
import { protegerPagina } from "../middleware/auth.js";

import express from 'express';

const router = express.Router();

router.get('/', protegerPagina, controllerAbastecimento.telaAbastecimento);

router.post('/', controllerAbastecimento.listarAbastecimentos);

router.post('/adicionar', controllerAbastecimento.criarAbastecimento);

router.post('/procurar', controllerAbastecimento.procurarAbastecimento);

router.post('/listar', controllerAbastecimento.listarAbastecimentos);

router.post('/deletar', controllerAbastecimento.deletarAbastecimento);

router.put('/atualizar', controllerAbastecimento.atualizarAbastecimento);

export default router;
