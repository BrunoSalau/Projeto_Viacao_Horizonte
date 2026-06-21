import { Router } from 'express';
import { controllerViagem } from '../controllers/viagem.controller.js';

const router = Router();

// RENDERIZAR PÁGINA
router.get('/', controllerViagem.telaViagem);

// LISTAR VIAGENS
router.get('/listar', controllerViagem.listarViagens);

// PROCURAR VIAGEM POR ID
router.post('/procurar', controllerViagem.procurarViagem);

// CRIAR VIAGEM
router.post('/adicionar', controllerViagem.criarViagem);

// ATUALIZAR VIAGEM
router.put('/atualizar', controllerViagem.atualizarViagem);

// ALTERAR STATUS DA VIAGEM
router.put('/alterar-status', controllerViagem.alterarStatusViagem);

// DELETAR VIAGEM
router.post('/deletar', controllerViagem.deletarViagem);

// LISTAR ROTAS DISPONÍVEIS (para select no modal)
router.post('/rotas', controllerViagem.listarRotasDisponiveis);

// LISTAR VEÍCULOS DISPONÍVEIS (para select no modal)
router.post('/veiculos', controllerViagem.listarVeiculosDisponiveis);

// LISTAR MOTORISTAS DISPONÍVEIS (para select no modal)
router.post('/motoristas', controllerViagem.listarMotoristasDisponiveis);

export default router;
