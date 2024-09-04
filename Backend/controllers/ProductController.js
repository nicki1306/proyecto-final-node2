import Product from '../models/ProductModel.js';
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
export const getProducts = async () => {
    try {
        await MongoSingleton.getInstance();
        const products = await Product.find();
        if (!products || products.length === 0) {
            throw new Error('No se encontraron productos');
        }
        return products;
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
};

// Obtener un producto por ID
export const getProductById = async (productId) => {
    try {
        await MongoSingleton.getInstance();
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('No se encontró el producto');
        }
        return product;
    } catch (error) {
        throw new Error('Error al obtener el producto');
    }
};

// Actualizar un producto
export const updateProduct = async (productId, productData) => {
    try {
        await MongoSingleton.getInstance();
        const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
        if (!updatedProduct) {
            throw new Error('No se encontró el producto');
        }
        return updatedProduct;
    } catch (error) {
        throw new Error('Error al actualizar el producto');
    }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
    try {
        const product = new Product(productData);
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw new Error('Error al crear el producto');
    }
};

// Obtener productos por categoría
export const getProductsByCategory = async (category) => {
    await MongoSingleton.getInstance();
    
    return await Product.find({ category });
};

// Eliminar un producto
export const deleteProduct = async (productId) => {
    try {
        await MongoSingleton.getInstance();
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            throw new Error('No se encontró el producto');
        }

    const user = await user.findById(deleteProduct.userId);
        if (user && user.role === 'premium') {

            const mailOptions = {
                from: 'tuemail@gmail.com',
                to: user.email,
                subject: 'Producto eliminado',
                text: `Estimado/a ${user.first_name}, su producto "${deleteProduct.toy_name}" ha sido eliminado.`
            };

            await transport.sendMail(mailOptions);
        }

        return deleteProduct; 
    } catch (error) {
        throw new Error('Error al eliminar el producto'); 
    }
};
