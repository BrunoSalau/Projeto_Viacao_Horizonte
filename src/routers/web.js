import { mostrar, criarMotorista, listarMotoristas, deletarTudo } from '../controller/home.controller.js'
import {cadastro} from '../controller/cadastro.controller.js'
import express from 'express';

const router = express.Router();

router.get('/',mostrar);

router.post('/criarMotorista',criarMotorista)

router.post('/listarMotoristas',listarMotoristas)

router.post('/deletarTudo',deletarTudo)

router.get('/cadastro',cadastro)

export default router;
