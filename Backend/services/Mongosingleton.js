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
                serverSelectionTimeoutMS: 30000, 
                socketTimeoutMS: 45000,
            });
            console.log('MongoDB conectado', config.MONGO_URI);
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

