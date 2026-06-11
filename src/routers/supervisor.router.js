import { controllerSupervisor } from "../controllers/supervisor.controller.js";
import express from 'express';

const router = express.Router();

router.get('/listarSupervisores', controllerSupervisor.listarSupervisores);
router.post('/buscarSupervisor', controllerSupervisor.buscarSupervisor);
router.put('/atualizarSupervisor', controllerSupervisor.atualizarSupervisor);

export default router;
