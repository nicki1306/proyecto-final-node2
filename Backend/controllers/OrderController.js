import Order from '../models/OrderModel.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
    try {
        const { name, address, paymentMethod, items, total } = req.body;

        const userEmail = req.user.email;

        if (!name || !userEmail || !address || !paymentMethod || items.length === 0 || !total) {
            return res.status(400).json({ message: 'Faltan datos para completar la orden.' });
        }

        for (let item of items) {
            if (!mongoose.isValidObjectId(item.productId)) {
                return res.status(400).json({ message: `El productId ${item.productId} no es válido.` });
            }
        }

        const newOrder = new Order({
            name,
            email: userEmail,
            address,
            paymentMethod,
            items,
            total,
            createdAt: new Date()
        });

        await newOrder.save();

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error al procesar la orden:', error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

export const getOrdersByUser = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const orders = await Order.find({ email: userEmail });
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error al obtener las ordenes:', error);
        res.status(500).json({ message: 'Failed to get orders', error: error.message });
    }    
};
