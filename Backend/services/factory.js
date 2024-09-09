import config from '../config.js';

let factoryProductService = {};

const loadService = async () => {
    switch (config.PERSISTENCE) {
        case 'ram':
            console.log('Persistencia a RAM');
            const { default: RamService } = await import('../controllers/ProductController.js');
            return RamService;

        case 'mongo':
            console.log('Persistencia a MONGODB');
            const { default: MongoSingleton } = await import('../services/Mongosingleton.js');
            await MongoSingleton.getInstance(); 

            const { default: MongoService } = await import('../services/MongoService.js');
            return MongoService;

        default:
            throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
    }
};

(async () => {
    factoryProductService = await loadService();
})();

export default factoryProductService;
