import express from 'express';
import Compression from 'compression';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory } from '../controllers/ProductController.js';
import ProductModel from '../models/ProductModel.js';
import { isAdmin, verifyToken } from '../services/utils.js';

const router = express.Router();

router.use(Compression({ brotli: { enabled: true }, gzip: { enabled: true } }));

router.get('/', getProducts);

router.get('/:id', getProductById);


router.get('/category/:category', getProductsByCategory);

router.get('/search', async (req, res) => {
    const query = req.query.query; 
    try {
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const products = await products.find({ toy_name: new RegExp(query, 'i') }); 
        res.json({ products });
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ message: 'Error fetching search results' });
    }
});

// Crear un nuevo producto (solo para admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const savedProduct = await createProduct(req.body);
        res.status(201).json(savedProduct); 
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto (solo para admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un producto (solo para admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
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
