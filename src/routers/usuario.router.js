import { controllerUsuario } from "../controllers/usuario.controller.js";
import { autenticar, somenteSupervisor, protegerPagina } from '../middleware/auth.js';
import express from 'express';

const router = express.Router();

router.get('/perfil', autenticar, controllerUsuario.mostrarInfo);

router.post('/criarUsuario', autenticar, controllerUsuario.criarUsuario);
router.post('/deletarUsuario', autenticar, controllerUsuario.deletarUsuario);
router.post('/login', controllerUsuario.login);
router.post('/logout', controllerUsuario.logout);

router.get('/criar-supervisor', autenticar, controllerUsuario.mostrarTelaCriarSupervisor);
router.post('/criarSupervisorAdmin', autenticar, controllerUsuario.criarSupervisorAdmin);


export default router;