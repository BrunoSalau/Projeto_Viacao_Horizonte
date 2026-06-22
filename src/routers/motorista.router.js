import { controllerMotorista } from "../controllers/motorista.controller.js";
import { protegerPagina, protegerPaginaMotorista } from "../middleware/auth.js";
import express from 'express';

const router = express.Router();

// Tela do supervisor (lista de motoristas)
router.get('/', protegerPagina, controllerMotorista.mostrarTela);
router.post('/', controllerMotorista.mostrarTela);

// Tela do motorista logado (painel simples)
router.get('/painel', protegerPaginaMotorista, controllerMotorista.mostrarPainelMotorista);

// API: viagens do motorista logado
router.get('/minhasViagens', controllerMotorista.minhasViagens);

// APIs do supervisor
router.get('/listarMotoristas', controllerMotorista.listarMotoristas);
router.post('/buscarMotorista', controllerMotorista.buscarMotorista);
router.put('/atualizarMotorista', controllerMotorista.atualizarMotorista);

export default router;
