import express from "express";
import { controllerRota } from "../controllers/rota.controller.js";

const router = express.Router();

router.post("/criarRota",controllerRota.criarRota);
router.post("/listarRotas",controllerRota.listarRotas);
router.post("/deletarRota",controllerRota.deletarRota);

export default router;