import { painel } from '../controllers/painel.controller.js'

import express from 'express';

const router = express.Router();

router.get('/',painel);

export default router;