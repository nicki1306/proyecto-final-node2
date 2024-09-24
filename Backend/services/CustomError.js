export default class CustomError extends Error {
    constructor({ name = 'CustomError', message = '', code = 500, status = 500, cause = null }) {
        super(message); 
        this.name = name;
        this.status = status;
        this.code = code;
        if (cause) {
            this.cause = cause;
        }
    }

    static createError({ name = 'CustomError', message = '', code = 500, status = 500, cause = null }) {
        const error = new CustomError({ name, message, code, status, cause });
        return error;
    }
}
