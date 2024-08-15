import express from 'express';
import Compression from 'compression';
import { getProducts, createProduct } from '../controllers/ProductController.js';

const router = express.Router();

router.use(Compression({ brotli: { enabled: true }, gzip: { enabled: true } }));

router.get('/', Compression({ brotli: true, gzip: true, deflate: true }), getProducts);
router.post('/', createProduct);

export default router;
