import express from 'express';
import Compression from 'compression';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory, getOnSaleProducts, searchProducts } from '../controllers/ProductController.js';
import { isAdmin, verifyToken } from '../services/utils.js';

const router = express.Router();

router.use(Compression({ brotli: { enabled: true }, gzip: { enabled: true } }));

// Obtener los productos en oferta

router.get('/category/ofertas', getOnSaleProducts);

// Obtener todos los productos

router.get('/', getProducts);

// Obtener un producto por ID

router.get('/:id', getProductById);

// Obtener los productos por categoría

router.get('/category/:category', getProductsByCategory);

// Buscar un producto

router.get('/search/:query', searchProducts);

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
