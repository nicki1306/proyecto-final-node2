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
router.post('/', verifyToken, isAdmin, createProduct);

// Actualizar un producto (solo para admin)
router.put('/:id', verifyToken, isAdmin, updateProduct);

// Eliminar un producto (solo para admin)
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

// Ruta de prueba para verificar si el usuario es admin
router.get('/admin', verifyToken, isAdmin, (req, res) => { 
    res.status(200).json({ message: 'Soy un administrador' });
});

export default router;
