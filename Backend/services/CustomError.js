export default class CustomError extends Error {
    static createError({name="CustomError", message=""}, statusCode, cause) {
        const error =new Error(message,{
            cause: message
        }); 
        error.name = name;
        error.statusCode = statusCode;
        error.code=cause;
        return error;
    }
}