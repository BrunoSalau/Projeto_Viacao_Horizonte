import { mostrar } from '../controllers/login.controller.js'
import {controllerUsuario} from '../controllers/usuario.controller.js'
import {cadastro} from '../controllers/cadastro.controller.js'
import express from 'express';

const router = express.Router();

router.get('/',mostrar);

router.get('/cadastro',cadastro)

export default router;
