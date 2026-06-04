import { controllerUsuario } from "../controllers/usuario.controller.js";

import express from 'express';

const router = express.Router();

router.post('/criarUsuario',controllerUsuario.criarUsuario);

router.post('/listarUsuarios',controllerUsuario.listarUsuarios);

router.post('/deletarUsuario',controllerUsuario.deletarUsuario);

router.post('/login',controllerUsuario.login);

export default router;