import express from "express";
import { controllerAbastecimento } from "../controllers/abastecimento.controller.js";

const router = express.Router();

router.post("/criarAbastecimento",controllerAbastecimento.criarAbastecimento);
router.post("/listarAbastecimentos",controllerAbastecimento.listarAbastecimentos);
router.post("/deletarAbastecimento",controllerAbastecimento.deletarAbastecimento);

export default router;