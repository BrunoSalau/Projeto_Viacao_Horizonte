import { mostrar, criarMotorista, listarMotoristas, deletarTudo } from '../controller/home.controller.js'
import express from 'express';

const router = express.Router();

router.get('/',mostrar);

router.post('/criarMotorista',criarMotorista)

router.post('/listarMotoristas',listarMotoristas)

router.post('/deletarTudo',deletarTudo)

export default router;
