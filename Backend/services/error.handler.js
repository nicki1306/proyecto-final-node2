import config, { errorDictionary } from '../config.js';


const errorsHandler = (error, req, res, next) => {
    console.log('Error capturado por el manejador de errores:', error);

    const errorCode = error?.type?.code || 0;
    const customErr = errorDictionary[errorCode] || errorDictionary.UNHANDLED_ERROR;

    console.log('custom error' ,customErr);

    const customError = {

        name: customErr.name,
        code: customErr.code,
        status: customErr.status,
        message: customErr.message,
        details: error.stack,
    };
    
    return res.status(customErr.status).send({ origin: config.SERVER, payload: '', error: customErr.message, details: process.env.NODE_ENV === 'development' ? error.stack : null });
}

export default errorsHandler;