import { controllerMotorista } from "../controllers/motorista.controller.js";
import express from 'express';

const router = express.Router();

router.get('/listarMotoristas', controllerMotorista.listarMotoristas);
router.post('/buscarMotorista', controllerMotorista.buscarMotorista);
router.put('/atualizarMotorista', controllerMotorista.atualizarMotorista);

export default router;
