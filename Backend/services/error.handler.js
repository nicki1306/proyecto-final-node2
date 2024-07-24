

const errorsHandler = (error, req, res, next) => {
    console.log('ingresa');
    let customErr = errorDictionary[0];
    for (const key in errorDictionary) {
        if (errorDictionary[key].code === error.type.code) customErr = errorDictionary[key];
    }
    
    return res.status(customErr.status).send({ origin: config.SERVER, payload: '', error: customErr.message });
}

export default errorsHandler;