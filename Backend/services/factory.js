import config from '../config.js';

let factoryProductService = {};

switch (config.PERSISTENCE) {
    case 'ram':
        console.log('Persistencia a RAM');
        const RamService = await import('../controllers/ProductController.js');
        factoryProductService = RamService.default;
        break;

    case 'mongo':
        console.log('Persistencia a MONGODB');
        const { default: MongoSingleton } = await import('./Mongosingleton.js');
        await MongoSingleton.getInstance();
        
        const MongoService = await import('../services/Mongosingleton.js');
        factoryProductService = MongoService.default;
        break;
        
    default:
        throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryProductService;