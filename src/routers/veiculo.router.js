import express from "express";
import { controllerVeiculo } from "../controllers/veiculo.controller.js";

const router = express.Router();

router.post("/criarVeiculo",controllerVeiculo.criarVeiculo);
router.post("/listarVeiculos",controllerVeiculo.listarVeiculos);
router.post("/deletarVeiculo",controllerVeiculo.deletarVeiculo);

export default router;