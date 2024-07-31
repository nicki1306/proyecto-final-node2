import config, { errorDictionary } from '../config.js';


const errorsHandler = (error, req, res, next) => {
    console.log('ingresa');

    const errorCode = (error?.type?.code) || 0;
    let customErr = errorDictionary[0];
    for (const key in errorDictionary) {
        if (errorDictionary[key].code === error.type.code) customErr = errorDictionary[key];
    }

    const customError = {
        code: customErr.code,
        status: customErr.status,
        message: customErr.message
    };
    
    return res.status(customErr.status).send({ origin: config.SERVER, payload: '', error: customErr.message });
}

export default errorsHandler;