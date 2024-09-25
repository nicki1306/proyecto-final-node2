import winston from 'winston';
import config from '../config.js';

// Logger para desarrollo
const devLogger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }), 
        new winston.transports.File({ filename: 'combined.log' }), 
    ],
});

// Logger para producción
const prodLogger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({ level: 'error' }),
        new winston.transports.File({ 
            filename: `${config.DIRNAME}/logs/errors.log`, 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: `${config.DIRNAME}/logs/combined.log`, 
            level: 'info' 
        }), 
    ],
});

// Middleware para agregar el logger según el entorno
const addLogger = (req, res, next) => {
    if (config.MODE === 'dev') {
        req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    }
    req.logger.info(`Logger initialized - ${new Date().toDateString()} - ${req.method} ${req.url}`);
    next();
};

export default addLogger;
