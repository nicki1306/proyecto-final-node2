import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class MongoSingleton {
    static instance;

    static async getInstance() {
        if (!MongoSingleton.instance) {
            try {
                console.log('Intentando conectar a MongoDB...');
                MongoSingleton.instance = await mongoose.connect(process.env.MONGO_URI, {
                    //useNewUrlParser: true,
                    //useUnifiedTopology: true,
                    serverSelectionTimeoutMS: 10000,
                });
                console.log('MongoDB conectado exitosamente');
            } catch (error) {
                console.error('Error al conectar a MongoDB:', error);
                throw error;
            }
        } else {
            console.log('Instancia de MongoSingleton ya existe');
        }
        return MongoSingleton.instance;
    }
}


export default MongoSingleton;
