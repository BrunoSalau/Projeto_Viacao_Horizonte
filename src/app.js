import express from 'express';
import routes from './routers/web.js'
import routesUsuario from './routers/login.router.js'

const app = express()

app.set('view engine','ejs');

app.set('views', `${import.meta.dirname}/views`);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.use('/', routes);

app.use('/', routesUsuario);

export default app;