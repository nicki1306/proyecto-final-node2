import express from 'express';
import { createOrder } from '../controllers/OrderController.js';
import { verifyToken } from '../services/utils.js';
import Order from '../models/OrderModel.js';

const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', verifyToken, createOrder);

// Ruta para obtener las órdenes del usuario autenticado
router.get('/user-orders', verifyToken, async (req, res) => {
    try {
        // Verifica que el token haya sido correctamente decodificado y que haya un usuario autenticado
        if (!req.user || !req.user.userId) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permisos para acceder a esta información.' });
        }

        // Busca las órdenes del usuario autenticado
        const orders = await Order.find({ userId: req.user.userId });

        // Enviar la respuesta con las órdenes encontradas
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
});

export default router;
