import { painel } from '../controllers/painel.controller.js'
import { protegerPagina } from '../middleware/auth.js';

import express from 'express';

const router = express.Router();

router.get('/', protegerPagina, painel);

export default router;
