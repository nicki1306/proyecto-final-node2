import path from 'path';
import dotenv from 'dotenv';
import { Command } from 'commander';

const commandLine = new Command();
commandLine
.option('--server <server>', 'Environment server', 'dev')
.option('--port <port>', 'Port number')
.option('--setup <number>', 'Setup number')
commandLine.parse();
const clOptions = commandLine.opts();

dotenv.config({ path: clOptions.server === 'prod' ? '.env.prod': '.env.dev' });

const config = {
    APP_NAME: 'Proyecto Node',
    PORT: process.env.PORT || clOptions.port || 8081 ,
    SERVER: 'ATLAS',
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://nicki:gatito1306.@cluster0.sxitpsr.mongodb.net/proyecto-node2?retryWrites=true&w=majority&appName=Cluster0',
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
    MODE: process.env.MODE || 'FORK',

    // Variables de entorno
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    PRODUCTS_PER_PAGE: 10,
    SECRET: process.env.SECRET,

    // Variables de Github
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

    // Variables de Google
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

    // Variables
    TWILO_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILO_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILO_PHONE: process.env.TWILIO_PHONE,

    get BASEDIR() { return this.DIRNAME.slice(0, -6) },
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/images` },

};

export const errorDictionary = {
    11000: { code: 11000, status: 400, message: 'Ya existe un usuario con ese correo' },
    11001: { code: 11001, status: 400, message: 'Ya existe un usuario con ese nombre de usuario' },
    UNHANDLED_ERROR: { code: 0, status: 500, message: 'Error no identificado' },
    ROUTING_ERROR: { code: 1, status: 404, message: 'No se encuentra el endpoint solicitado' },
    FEW_PARAMETERS: { code: 2, status: 400, message: 'Faltan parámetros obligatorios o se enviaron vacíos' },
    INVALID_MONGOID_FORMAT: { code: 3, status: 400, message: 'El ID no contiene un formato válido de MongoDB' },
    INVALID_PARAMETER: { code: 4, status: 400, message: 'El parámetro ingresado no es válido' },
    INVALID_TYPE_ERROR: { code: 5, status: 400, message: 'No corresponde el tipo de dato' },
    ID_NOT_FOUND: { code: 6, status: 400, message: 'No existe registro con ese ID' },
    PAGE_NOT_FOUND: { code: 7, status: 404, message: 'No se encuentra la página solicitada' },
    DATABASE_ERROR: { code: 8, status: 500, message: 'No se puede conectar a la base de datos' },
    INTERNAL_ERROR: { code: 9, status: 500, message: 'Error interno de ejecución del servidor' },
    RECORD_CREATION_ERROR: { code: 10, status: 500, message: 'Error al intentar crear el registro' },    
    RECORD_CREATION_OK: { code: 11, status: 200, message: 'Registro creado' }
};


export default config;