import express from 'express';
import routes from './routers/web.js'

const app = express()

app.set('view engine','ejs');

app.set('views', `${import.meta.dirname}/views`);

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', routes);

export default app;