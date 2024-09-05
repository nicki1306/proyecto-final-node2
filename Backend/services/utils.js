import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import MongoSingleton from './Mongosingleton.js';
import CustomError from './CustomError.js';
import { errorDictionary } from '../config.js';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const generateToken = (payload) => jwt.sign(payload, config.SECRET, { expiresIn: '1h' });

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        req.user = decoded;
        next();
    });
};

export const verifyRequiredBody = (requiredFields) => {
    return (req, res, next) => {
        const allOk = requiredFields.every(field =>
            req.body.hasOwnProperty(field) && req.body[field] !== '' && req.body[field] !== null && req.body[field] !== undefined
        );

        if (!allOk) throw new CustomError(errorDictionary.FEW_PARAMETERS, 400);

        next();
    };
};

export const verifyAllowedBody = (allowedFields) => {
    return (req, res, next) => {
        const allOk = allowedFields.every(field =>
            req.body.hasOwnProperty(field) && req.body[field] !== '' && req.body[field] !== null && req.body[field] !== undefined
        );  
        if (!allOk) return res.status(400).send({ origin: config.SERVER, payload: 'Propiedades no permitidas', allowedFields });
        next();
    };
};

export const verifyMongoDBId = (id) => {
    return (req, res, next) => {
        if (!config.MONGODB_ID_REGEX.test(req.params[id])) 
            return res.status(400).send({ origin: config.SERVER, payload: null, error: 'Id no valido' });
        next();
    };
};

export const verifyDbConn = (req, res, next) => {
    MongoSingleton.getInstance();
    next();
};

export const handlePolicies = policies => {
    return async (req, res, next) => {
        if (!policies.includes(req.user.role)) {
            return res.status(403).send({ origin: config.SERVER, payload: 'No autorizado' });
        }
        next();
    };
};
