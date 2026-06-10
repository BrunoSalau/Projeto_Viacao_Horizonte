import express from 'express';
import routes from './routers/web.js'
import usuario from './routers/usuario.router.js'
import veiculo from './routers/veiculo.router.js'
import painel from './routers/painel.router.js'

const app = express()


app.set('view engine','ejs');

app.set('views', `${import.meta.dirname}/views`);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.use('/', routes);

app.use('/', usuario);

app.use('/veiculo', veiculo)

app.use('/painel', painel)

export default app;