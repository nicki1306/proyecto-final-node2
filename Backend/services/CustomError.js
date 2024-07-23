export default class CustomError {
    static createError({name="CustomError", message="", statusCode=500}, statusCode, cause) {
        const error =new Error(message,{
            cause: message
        }); 
        error.name = name;
        error.statusCode = statusCode;
        error.code=cause;
        return error;
    }
}