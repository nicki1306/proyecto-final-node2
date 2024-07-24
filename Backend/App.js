import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv, { config } from 'dotenv';
import session from 'express-session';
import fileStorage from 'session-file-store';
import mongoose from 'mongoose';
import passport from 'passport';
import Compression from 'express';
import businessRouter from './routes/BusinessRoutes.js';
import initSocket from './services/socket.io.js';
import MongoSingleton from './services/Mongosingleton.js';
import errorsHandler from './services/error.handler.js';

import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/CartRoutes.js';
import userRouter from './routes/UserRoutes.js';
import AuthRouter from './routes/AuthRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(Compression());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Configuraciones
app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));    

app.use(passport.initialize());
app.use(passport.session());

// Configurar las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req, res) => {
    res.cookie('testCookie', 'testValue', { httpOnly: true });
    res.send(["Hello World!"]);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
}));

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.use('/api/products', productRouter);
app.use('/api/business', businessRouter);
app.use('/api/cart', cartRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', AuthRouter);

// Manejo de errores
app.use(errorsHandler);

// Manejo de archivos estáticos
app.use('/static', express.static(`${__dirname}/public`));


// Iniciar el servidor y conectar a MongoDB
const PORT = process.env.PORT || 8080;

const expressInstance = app.listen(PORT, () => {
    try {
        MongoSingleton.getInstance();
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
});

// Inicializar socket.io
const socketServer = initSocket(expressInstance);
app.set('socketServer', socketServer);

export default app;
