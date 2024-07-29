import CustomRouter from './Custom.routes.js';

export default class TestRouter extends CustomRouter {
    init () {
        this.get('/', async(req, res) => {
            res.sendSuccess('OK desde clase personalizada!');
        })
    }
}