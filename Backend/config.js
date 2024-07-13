import path from 'path';
import dotenv from 'dotenv';
import { Command } from 'concurrently';

const commandLine = new Command();
commandLine
    .option('--server <server>')
    .option('--port <port>')
    .option('--setup <number>')
commandLine.parse();
const clOptions = commandLine.opts();

dotenv.config({ path: clOptions.mode === 'setup' ? path.join(__dirname, '../.env.setup') : path.join(__dirname, '../.env') });

const config = {
    APP_NAME: 'Proyecto Node',
    PORT: process.env.PORT || clOptions.port || 8080,
    SERVER: 'ATLAS',
    MONGO_URI: 'mongodb+srv://nicki:gatito1306.@cluster0.sxitpsr.mongodb.net/',
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    PRODUCTS_PER_PAGE: 10,
    SECRET: process.env.SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

    get UPLOAD_DIR() { return `${this.DIRNAME}/public/images` },

};

export default config;