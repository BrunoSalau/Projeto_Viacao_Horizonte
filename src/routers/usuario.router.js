import { controllerUsuario } from "../controllers/usuario.controller.js";
import { autenticar, somenteSupervisor } from '../middleware/auth.js';
import express from 'express';

const router = express.Router();

router.post('/criarUsuario', autenticar, somenteSupervisor, controllerUsuario.criarUsuario);
router.post('/deletarUsuario', autenticar, somenteSupervisor, controllerUsuario.deletarUsuario);
router.post('/login', controllerUsuario.login);
router.post('/logout', controllerUsuario.logout);

export default router;