import { controllerMotorista } from "../controllers/motorista.controller.js";
import { protegerPagina } from "../middleware/auth.js";
import express from 'express';

const router = express.Router();

router.get('/', protegerPagina, controllerMotorista.mostrarTela);

router.get('/listarMotoristas', controllerMotorista.listarMotoristas);
router.post('/buscarMotorista', controllerMotorista.buscarMotorista);
router.put('/atualizarMotorista', controllerMotorista.atualizarMotorista);

export default router;
