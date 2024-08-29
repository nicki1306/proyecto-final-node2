import express from 'express';
import Compression from 'compression';
import { getProducts, getProductById, createProduct } from '../controllers/ProductController.js';

const router = express.Router();

router.use(Compression({ brotli: { enabled: true }, gzip: { enabled: true } }));

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un producto por ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const savedProduct = await createProduct(req.body);
        res.status(201).json(savedProduct); 
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

export default router;

