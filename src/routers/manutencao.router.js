import express from "express";
import {controllerManutencao} from "../controllers/manutencao.controller.js";

const router = express.Router();

router.post("/criarManutencao", controllerManutencao.criarManucencao);
router.post("/listarManutencao", controllerManutencao.listarManucencao);
router.post("/deletarManutencao", controllerManutencao.deletarManucencao);

export default router;