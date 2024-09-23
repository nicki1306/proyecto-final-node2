import Order from '../models/OrderModel.js';
import Product from '../models/ProductModel.js';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const generateTicketHtml = (order) => {
    return `
        <h1>Gracias por tu compra!</h1>
        <p>Este es tu ticket de compra:</p>
        <ul>
            ${order.items.map(item => `
                <li>${item.productId.toy_name} - ${item.quantity} x $${item.productId.price}</li>
            `).join('')}
        </ul>
        <p>Total: $${order.total}</p>
        <p>Fecha: ${new Date(order.createdAt).toLocaleString()}</p>
    `;
};

export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, address, paymentMethod, items, total } = req.body;
        console.log('Datos de la orden:', { name, address, paymentMethod, items, total });

        const userId = req.user.userId;
        const userEmail = req.user?.email;

        if (!name || !userEmail || !address || !paymentMethod || items.length === 0 || !total) {
            return res.status(400).json({ message: 'Faltan datos para completar la orden.' });
        }

        for (let item of items) {
            if (!mongoose.isValidObjectId(item.productId)) {
                return res.status(400).json({ message: `El productId ${item.productId} no es válido.` });
            }

            const product = await Product.findById(item.productId).session(session);

            if (!product) {
                return res.status(404).json({ message: `El producto con id ${item.productId} no fue encontrado.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `No hay suficiente stock para el producto "${product.toy_name}". Stock disponible: ${product.stock}, cantidad solicitada: ${item.quantity}` });
            }

            if (!product.imageUrl) {
                product.imageUrl = 'https://ruta/a/imagen_default.jpg';
                await product.save({ session });
            }
        }

        for (let item of items) {
            const product = await Product.findById(item.productId).session(session);
            product.stock -= item.quantity;
            await product.save({ session });
        }

        const newOrder = new Order({
            userId,
            name,
            email: req.user.email,
            address,
            paymentMethod,
            items,
            total,
            createdAt: new Date()
        });

        await newOrder.save({ session });
        await session.commitTransaction();
        session.endSession();

        const populatedOrder = await Order.findById(newOrder._id)
            .populate('items.productId', 'toy_name price imageUrl');

        const ticketHtml = generateTicketHtml(populatedOrder);

        const emailData = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: 'Tu ticket de compra',
            html: ticketHtml,
        };


        transporter.sendMail(emailData, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ message: 'Error al enviar el correo.' });
            }
            console.log('Correo enviado: ' + info.response);
            res.status(201).json({ message: 'Orden creada exitosamente y ticket enviado por correo.', order: populatedOrder });
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error al procesar la orden:', error);
        res.status(500).json({ message: 'Error al crear la orden', error: error.message });
    }
};
