import express from "express";
import { controllerMotorista } from "../controllers/motorista.controller.js";

const router = express.Router();

router.post("/criarMotorista",controllerMotorista.criarMotorista);
router.post("/listarMotoristas",controllerMotorista.listarMotoristas);
router.post("/buscarMotoristaCPF",controllerMotorista.buscarMotoristaCPF);
router.post("/deletarMotorista",controllerMotorista.deletarMotorista);

export default router;