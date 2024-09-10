import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import MongoSingleton from './Mongosingleton.js';
import CustomError from './CustomError.js';
import { errorDictionary } from '../config.js';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const generateToken = (user) => {
    const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role
    };
    //const secret = process.env.JWT_SECRET || 'mysecret';
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, config.SECRET, (err, decoded) => {
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

        if (!allOk) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        next();
    };
};

export const verifyAllowedBody = (allowedFields) => {
    return (req, res, next) => {
        const allOk = allowedFields.every(field =>
            req.body.hasOwnProperty(field) && req.body[field] !== '' && req.body[field] !== null && req.body[field] !== undefined
        );  
        if (!allOk) {
            return res.status(400).json({ message: 'Propiedades no permitidas', allowedFields });
        }
        next();
    };
};
import mongoose from 'mongoose';

export const verifyMongoDBId = (req, res, next) => {
    const { id } = req.params; 
    if (!id) {
        return res.status(400).json({ message: 'ID no proporcionado en la ruta' }); 
    }
    if (!mongoose.Types.ObjectId.isValid(id)) { 
        return res.status(400).json({ message: 'ID de MongoDB no válido' });
    }
    next();
};


export const verifyDbConn = (req, res, next) => {
    MongoSingleton.getInstance();
    next();
};

export const handlePolicies = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        next();
    };
};


export const isAdmin = (req, res, next) => {
    const user = req.user; 
    if (user && user.role === 'admin') {
        next();  
    } else {
        return res.status(403).json({ message: 'No autorizado' });
    }
};
