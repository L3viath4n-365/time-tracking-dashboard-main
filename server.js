import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import path from 'path';
import apiRouter from './routes/api.js'

const app = express();
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.req = req;
    res.locals.hasAll = (...keys) => keys.every(key => key in res.locals);
    res.locals.hasAny = (...keys) => keys.some(key => key in res.locals);
    next();
});

app.use('/', apiRouter);

app.use((req, res) => {
    res.status(404).render('index', { data: null, bgcolour:null, error: '404 — Page not found' });
});

app.use((err, req, res, next) => {
    if (nodeEnv === 'development') {
        console.error(err.stack);
    } else {
        console.error(`[Error]: ${err.message}`);
    }

    const statusCode = err.status || err.statusCode || 500;
    
    const clientMessage = nodeEnv === 'development' 
        ? err.response?.data?.error || err.message 
        : 'Internal Server Error';

    res.status(statusCode).render('index', { 
        data: null,
        bgcolour: null,
        error: `${statusCode} — ${clientMessage}` 
    });
});

app.listen(port, () => {
    console.log(`Server online on port ${port} (${nodeEnv})`);
});