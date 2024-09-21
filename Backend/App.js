import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploader } from './uploader.js';
import pkg from 'cloudinary';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import Compression from 'compression';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import cluster from 'cluster';
import fs from 'fs'; 

import businessRouter from './routes/businessRoutes.js';
import initSocket from './services/socket.io.js';
import MongoSingleton from './services/Mongosingleton.js';
import errorsHandler from './services/error.handler.js';

import TestRouter from './routes/test.routes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/CartRoutes.js';
import orderRoutes from './routes/orderroutes.js';
import userRouter from './routes/userRoutes.js';
import addLogger from './services/logger.js';
import cookiesRouter from './routes/cookies.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

const uploadRouter = express.Router();

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentation Backend',
            description: 'Documentación de la API Backend',
            version: '1.0.0',
        },
    },
    apis: ['./src/docs/routes/**/*.yaml.js'],
};
const specs = swaggerJSDoc(swaggerOptions);

if (cluster.isPrimary) {
    try {
        console.log('Master process is running');

        // Crea los workers
        for (let i = 0; i < 4; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
            cluster.fork();
        });
    } catch (error) {
        console.error('Error en el master process:', error);
        process.exit(1);
    }
} else {
    // Worker process: establecer conexión a MongoDB y middlewares
    (async () => {
        try {
            await MongoSingleton.getInstance();
            console.log(`Worker ${process.pid} conectado a MongoDB`);

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);

            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    try {
                        const uploadPath = path.join(__dirname, 'uploads', req.url.split('/')[2]);
                        fs.mkdirSync(uploadPath, { recursive: true });
                        cb(null, uploadPath);
                    } catch (err) {
                        cb(err, uploadPath);
                    }
                },
                filename: (req, file, cb) => {
                    cb(null, `${Date.now()}-${file.originalname}`);
                }
            });

            const upload = multer({ storage });

            const isProduccion = process.env.NODE_ENV === 'production';
            const origin = isProduccion ? 'https://backend-production-55b2.up.railway.app' : 'http://localhost:3000';
            console.log('Origen:', origin);

            // Middlewares
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            app.use(express.static(path.join(__dirname, '../frontend/dist')));
            app.use(Compression({ brotli: { enabled: true }, gzip: { enabled: true } }));
            app.use(cors({
                origin: origin,
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
            }));

            // Configuraciones
            app.use(addLogger);
            app.use(cookieParser(process.env.SECRET));
            app.use(session({
                secret: process.env.SECRET,
                resave: false,
                saveUninitialized: true,
            }));

            app.use(passport.initialize());
            app.use(passport.session());

            app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

            // Configurar las vistas
            app.set('view engine', 'ejs');
            app.set('views', path.join(__dirname, 'views'));

            // Ruta para subir imágenes
            app.post('/upload/products', upload.array('image'), (req, res) => {
                res.send('Archivo subido exitosamente');
            });

            app.post('/upload/documents', upload.array('documentImages', 10), (req, res) => {
                res.send('Documentos de usuario subidos con éxito');
            });

            // Rutas
            app.get('/', (req, res) => {
                res.cookie('testCookie', 'testValue', { httpOnly: true });
                res.send(["el backend funciona!"]);
            });

            app.post('/login', passport.authenticate('local', {
                successRedirect: '/dashboard',
                failureRedirect: '/login',
                failureFlash: true,
            }));

            app.get('/logout', (req, res, next) => { 
                req.logout(err => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/');
                });
            });

            app.use('/api/upload', uploadRouter);
            app.use('/api/products', productRouter);
            app.use('/api/orders', orderRoutes);
            app.use('/api/business', businessRouter);
            app.use('/api/cart', cartRouter);
            app.use('/api/user', userRouter);
            app.use('/api/test', TestRouter);
            app.use('/api/cookies', cookiesRouter);

            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
            });

            // Rutas de prueba
            app.get('/hello', (req, res) => {
                res.send('Hello World!');
            });

            // Manejo de errores
            app.use(errorsHandler);

            // Manejo de archivos estáticos
            app.use('/static', express.static(`${__dirname}/public`));

            const expressInstance = app.listen(PORT, () => {
                console.log(`Servidor escuchando en http://localhost:${PORT}`);
            });

            // Inicializar socket.io
            const socketServer = initSocket(expressInstance);
            app.set('socketServer', socketServer);
        } catch (error) {
            console.error(`Error al conectar a MongoDB en el worker ${process.pid}:`, error);
            process.exit(1);
        }
    })();
}

export default app;
