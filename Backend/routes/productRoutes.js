import express from 'express';
import Compression from 'express';
import { getProducts, createProduct } from '../controllers/ProductController.js';

const router = express.Router();

router.get('/', Compression({ brotli: true, gzip: true, deflate: true }), getProducts);
router.post('/', createProduct);

export default router;
