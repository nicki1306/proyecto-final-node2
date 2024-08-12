import config, { errorDictionary } from '../config.js';


const errorsHandler = (error, req, res, next) => {
    console.log('ingresa');

    const errorCode = (error?.type?.code) || 0;

    let customErr = errorDictionary[errorCode] || errorDictionary.UNHANDLED_ERROR;

    for (const key in errorDictionary) {
        if (errorDictionary[key].code === error.type.code) customErr = errorDictionary[key];
        break;
    }


    const customError = {
        
        name: customErr.name,
        code: customErr.code,
        status: customErr.status,
        message: customErr.message
    };
    
    return res.status(customErr.status).send({ origin: config.SERVER, payload: '', error: customErr.message });
}

export default errorsHandler;