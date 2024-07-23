import config, { errorDictionary } from "../config";

const errorsHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }    
    const { origin, payload } = err;
    const code = errorDictionary[payload];
    if (code) {
        return res.status(code).send({ origin, payload });
    }    
    return next(err);
};