import { controllerVeiculo } from "../controllers/veiculo.controller.js";
import { protegerPagina } from "../middleware/auth.js";

import express from 'express';

const router = express.Router();

router.get('/', protegerPagina, controllerVeiculo.telaVeiculo);

router.post('/',controllerVeiculo.listarVeiculos)

router.post('/adicionar',controllerVeiculo.criarVeiculo);

router.post('/procurar', controllerVeiculo.procurarVeiculo);

router.post('/listar', controllerVeiculo.listarVeiculos);

router.post('/deletar', controllerVeiculo.deletarVeiculo);

router.put('/atualizar', controllerVeiculo.atualizarVeiculo);
export default router;
