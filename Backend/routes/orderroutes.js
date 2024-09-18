import express from 'express';
import { createOrder } from '../controllers/OrderController.js';
import { verifyToken } from '../services/utils.js';
import Order from '../models/OrderModel.js';

const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', verifyToken, createOrder);

// Ruta para obtener todas las ordenes
router.get('/user-orders', verifyToken, async (req, res) => {
    try {

        if (!req.user || !req.user.userId) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permisos para acceder a esta información.' });
        }

        const orders = await Order.find({ userId: req.user.userId });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
});

export default router;
