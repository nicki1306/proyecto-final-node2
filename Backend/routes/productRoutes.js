import express from 'express';
import Compression from 'compression';
import { getProducts, createProduct } from '../controllers/ProductController.js';

const router = express.Router();

router.use(Compression({ brotli: { enabled: true }, gzip: { enabled: true } }));

router.get('/',async (req, res) => {
    try {
        const products = await getProducts(req, res);
        return res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', createProduct);

export default router;
