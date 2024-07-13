import mongoose from 'mongoose';
import config from '../config.js';

class MongoSingleton {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect(config.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('MongoDB conectado');
        } catch (error) {
            console.error('Error de conexión a MongoDB:', error);
            process.exit(1);
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new MongoSingleton();
        }
        return this.instance;
    }
}

export default MongoSingleton;