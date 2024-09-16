import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import MongoSingleton from '../services/Mongosingleton.js';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: '3f5vz@example.com',
        pass: '9sZUwVx7kQbJn4kVJG'
    }
});

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        await MongoSingleton.getInstance();
        const products = await Product.find({}, {
            _id: 1,
            toy_name: 1,
            manufacturer: 1,
            age_group: 1,
            price: 1,
            material: 1,
            color: 1,
            description: 1,
            image: 1,
            category: 1
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        products.forEach(product => console.log("Producto ID: ", product._id));
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        await MongoSingleton.getInstance();
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const productData = req.body;

    try {
        await MongoSingleton.getInstance();
        const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    const productData = req.body;
    try {
        await MongoSingleton.getInstance();
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        await MongoSingleton.getInstance();
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const user = await User.findById(deletedProduct.userId);
        if (user && user.role === 'premium') {
            const mailOptions = {
                from: 'tuemail@gmail.com',
                to: user.email,
                subject: 'Producto eliminado',
                text: `Estimado/a ${user.first_name}, su producto "${deletedProduct.toy_name}" ha sido eliminado.`
            };

            await transport.sendMail(mailOptions);
        }

        res.status(200).json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar el producto: ${error.message}` });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        await MongoSingleton.getInstance();
        const { category } = req.params;
        const products = await Product.find({ category });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos en esta categoría' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos por categoría', error: error.message });
    }
};

export const getOnSaleProducts = async (req, res) => {
    try {
        await MongoSingleton.getInstance();
        const onSaleProducts = await Product.find({ onSale: true });
        res.status(200).json(onSaleProducts);
    } catch (error) {
        console.error('Error al obtener productos en oferta:', error);
        res.status(500).json({ message: 'Error al obtener productos en oferta' });
    }
};

export const searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
        await MongoSingleton.getInstance();
        const products = await Product.find({ toy_name: new RegExp(query, 'i') });
        res.status(200).json(products);
    } catch (error) {    
        res.status(500).json({ message: 'Error al buscar productos', error: error.message });
    }    
};


