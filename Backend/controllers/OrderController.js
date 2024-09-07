import Order from '../models/OrderModel.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
    try {
        console.log('Datos recibidos en el body:', req.body);
        const { name, email, address, paymentMethod, items, total } = req.body;

        // Validar que todos los campos estén presentes
        if (!name || !email || !address || !paymentMethod || items.length === 0 || !total) {
            return res.status(400).json({ message: 'Faltan datos para completar la orden.' });
        }

        // Validar que todos los productId sean ObjectId válidos
        for (let item of items) {
            if (!mongoose.isValidObjectId(item.productId)) {
                return res.status(400).json({ message: `El productId ${item.productId} no es válido.` });
            }
        }

        // Crear y guardar la nueva orden
        const newOrder = new Order({
            name,
            email,
            address,
            paymentMethod,
            items,
            total,
            createdAt: new Date()
        });

        await newOrder.save();

        // Responder con éxito
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error al procesar la orden:', error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};
