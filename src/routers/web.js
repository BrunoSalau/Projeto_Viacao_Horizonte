import express from 'express';
import { mostrar } from '../controllers/home.controller.js'

const router = express.Router();

router.get('/',mostrar);

export default router;