import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routers/web.js'
import usuarioRouter   from './routers/usuario.router.js';
import motoristaRouter from './routers/motorista.router.js';
import supervisorRouter from './routers/supervisor.router.js';
import rotaRouter from './routers/rota.router.js';
import viagemRouter from './routers/viagem.router.js';

import veiculoRouter from './routers/veiculo.router.js';
import painelRouter from './routers/painel.router.js';
import manutencaoRouter from './routers/manutencao.router.js';
import abastecimentoRouter from './routers/abastecimento.router.js';

const app = express();


app.set('view engine','ejs');

app.set('views', `${import.meta.dirname}/views`);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

app.use('/', routes);

app.use('/usuario', usuarioRouter);

app.use('/motorista', motoristaRouter);

app.use('/supervisor', supervisorRouter);

app.use('/rota',rotaRouter);

app.use('/veiculo', veiculoRouter);

app.use('/painel', painelRouter);

app.use('/viagem', viagemRouter);

app.use('/manutencao', manutencaoRouter);

app.use('/abastecimento', abastecimentoRouter);

export default app;

