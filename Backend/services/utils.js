import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import MongoSingleton from './Mongosingleton.js';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const generateToken = (user) => {
    if (!user._id) {
        console.error("El usuario no tiene un _id válido:", user);
        throw new Error('El usuario no tiene un _id válido');
    }

    console.log("Tipo de _id:", typeof user._id);

    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
    };
    console.log("JWT_SECRET utilizado para generar el token:", process.env.JWT_SECRET);
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};


export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.error("Token no proporcionado en la solicitud.");
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    console.log("JWT_SECRET utilizado para verificar el token:", process.env.JWT_SECRET);
    console.log("Token recibido en la solicitud:", token);


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        console.log('Token decodificado correctamente:', decoded); 
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
    console.log("Usuario recibido en isAdmin:", user);
    if (user && user.role === 'admin') {
        next();  
    } else {
        console.log("Acceso no autorizado, el rol del usuario es:", user?.role);
        return res.status(403).json({ message: 'No autorizado' });
    }
};
