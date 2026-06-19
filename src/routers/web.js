import { mostrar, criarMotorista, listarMotoristas, deletarTudo } from '../controller/home.controller.js'
import { abastecimento } from '../controller/Abastecimento.Controller.js';
import { manutencao } from '../controller/Manutencao.Controller.js';
import { rotas } from '../controller/Rota.Controler.js';
import { viagens } from '../controller/Viagem.Controller.js';
import { veiculos } from '../controller/Veiculos.Controller.js';
import {cadastro} from '../controller/cadastro.controller.js'
import {motoristas} from '../controller/motorista.controller.js'
import express from 'express';

const router = express.Router();

router.get('/',mostrar);

router.post('/criarMotorista',criarMotorista)

router.post('/listarMotoristas',listarMotoristas)

router.post('/deletarTudo',deletarTudo)

router.get('/cadastro',cadastro)

router.get('/abastecimento', abastecimento);

router.get('/manutencao', manutencao);

router.get('/rotas', rotas);

router.get('/viagens', viagens);

router.get('/veiculos', veiculos);

router.get('/motoristas', motoristas);

export default router;


