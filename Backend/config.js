import path from 'path';
import dotenv from 'dotenv';
import { Command } from 'commander';

const commandLine = new Command();
commandLine
    .option('--server <server>')
    .option('--port <port>')
    .option('--setup <number>')
commandLine.parse();
const clOptions = commandLine.opts();

dotenv.config({ path: clOptions.server === 'prod' ? '.env.prod': '.env.dev' });

const config = {
    APP_NAME: 'Proyecto Node',
    PORT: process.env.PORT || clOptions.port || 8080,
    SERVER: 'ATLAS',
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://nicki:gatito1306.@cluster0.sxitpsr.mongodb.net/',
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    PERSISTENCE: 'MONGO',

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

    get UPLOAD_DIR() { return `${this.DIRNAME}/public/images` },

};

export const errorDictionary = {
    11000: 'Ya existe un usuario con ese correo',
    11001: 'Ya existe un usuario con ese nombre de usuario',
};

export default config;