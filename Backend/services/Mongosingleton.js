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
            console.log('MongoDB conectado');
        } catch (error) {
            console.error('Error de conexión a MongoDB:', error);
            process.exit(1);
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
