import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import MongoSingleton from './Mongosingleton.js';
import CustomError from './CustomError.js';
import { errorDictionary } from '../config.js';


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const createToken = (payload, duration) => jwt.sign(payload, config.SECRET, { expiresIn: duration });
export const verifyToken = (req, res, next) => {

    const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`] ? req.cookies[`${config.APP_NAME}_cookie`] : undefined;
    const queryToken = req.query.access_token ? req.query.access_token : undefined;
    const receivedToken = headerToken || cookieToken || queryToken;

    if (!receivedToken) return res.status(401).send({ origin: config.SERVER, payload: 'Se requiere token' });

    jwt.verify(receivedToken, config.SECRET, (err, payload) => {
        if (err) return res.status(403).send({ origin: config.SERVER, payload: 'Token no válido' });
        req.user = payload;
        next();
    });
}

export const verifyRequiredBody = (requiredFields) => {
    return (req, res, next) => {
        const allOk = requiredFields.every(field =>
            req.body.hasOwnProperty(field) && req.body[field] !== '' && req.body[field] !== null && req.body[field] !== undefined
        );

        if (!allOk) throw new CustomError(errorDictionary.FEW_PARAMETERS, 400);};
        
        next();
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

export const veryfyDbConn = (req, res, next) => {
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
}




