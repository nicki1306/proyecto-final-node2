import mongoose from 'mongoose';
import config from '../config.js';


mongoose.pluralize(null);


class MongoSingleton {
    constructor() {
        if (MongoSingleton.instance) {
            return MongoSingleton.instance;
        }
        this.connect();
        MongoSingleton.instance = this;
    }

    async connect() {
        try {
            await mongoose.connect(config.MONGO_URI, {
                serverSelectionTimeoutMS: 10000, 
                socketTimeoutMS: 4500,
            });
            mongoose.connection.on('connected', () => {
                console.log('MongoDB conectado correctamente');
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB se ha desconectado');
            });

            mongoose.connection.on('error', (err) => {
                console.error('Error en la conexión de MongoDB:', err);
            });

        } catch (error) {
            console.error('Error de conexión a MongoDB:', error);
            process.exit(1);
        }
    }

    async disconnect() {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('MongoDB desconectado');
        }
    }

    static getInstance() {
        if (!MongoSingleton.instance) {
            MongoSingleton.instance = new MongoSingleton();
        }
        return MongoSingleton.instance;
    }
}

export default MongoSingleton;

