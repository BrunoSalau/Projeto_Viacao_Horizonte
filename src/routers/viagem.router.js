import express from "express";
import { controllerViagem } from "../controllers/viagem.controller.js";

const router = express.Router();

router.post("/criarViagem",controllerViagem.criarViagem);
router.post("/listarViagens",controllerViagem.listarViagens);
router.post("/deletarViagem",controllerViagem.deletarViagem);

export default router;