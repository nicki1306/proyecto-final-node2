import express from 'express';
import Compression from 'compression';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory } from '../controllers/ProductController.js';
import { isAdmin, verifyToken } from '../services/utils.js';

const router = express.Router();

router.use(Compression({ brotli: { enabled: true }, gzip: { enabled: true } }));

// Ruta para obtener todos los productos (accesible para todos)
router.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un producto por ID (accesible para todos)
router.get('/products/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para crear un nuevo producto (solo para administradores)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const savedProduct = await createProduct(req.body);
        res.status(201).json(savedProduct); 
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Ruta para obtener productos por categoría (accesible para todos)
router.get('/category/:category', async (req, res) => {
    try {
        const products = await getProductsByCategory(req.params.category);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para actualizar un producto (solo para administradores)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Ruta para eliminar un producto (solo para administradores)
router.delete('/products/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const deletedProduct = await deleteProduct(req.params.id);
        res.status(200).json(deletedProduct);
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Ruta de prueba para verificar si el usuario es admin
router.get('/admin', verifyToken, isAdmin, (req, res) => { 
    res.status(200).json({ message: 'Soy un administrador' });
});

export default router;
