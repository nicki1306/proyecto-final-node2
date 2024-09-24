import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import MongoSingleton from '../services/Mongosingleton.js';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';


const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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
            category: 1,
            stock: 1,  
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

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
    const {id} = req.params;
    const productData = req.body;

    try {
        await MongoSingleton.getInstance();
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
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
    const { toy_name, manufacturer, age_group, price, material, color, description, category, imageUrl, stock } = req.body;
    try {
        await MongoSingleton.getInstance();
        let uploadedImageUrl = '';
        if (imageUrl) {
            try {
                const uploadResult = await cloudinary.v2.uploader.upload(imageUrl, {
                    folder: 'toy_store',
                    use_filename: true,
                    unique_filename: false,
                });
                uploadedImageUrl = uploadResult.secure_url;
            } catch (error) {
                return res.status(500).json({ message: 'Error al subir la imagen', error: error.message });
            }
        }

        // Crear el nuevo proyecto
        const newProduct = new Product({
            toy_name,
            manufacturer,
            age_group,
            price,
            material,
            color,
            description,
            category,
            image: uploadedImageUrl,
            stock
        });

        // Guardar el proyecto
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
};

/// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params; 
    try {
        await MongoSingleton.getInstance();
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Buscar al usuario asociado al producto eliminado (si existe userId)
        if (deletedProduct.userId) {
            const user = await User.findById(deletedProduct.userId);
            if (user && user.role === 'premium') {
                const mailOptions = {
                    from: 'tuemail@gmail.com',
                    to: user.email,
                    subject: 'Producto eliminado',
                    text: `Estimado/a ${user.first_name}, su producto "${deletedProduct.toy_name}" ha sido eliminado.`
                };
                
                // Enviar el correo al usuario
                await transport.sendMail(mailOptions);
            }
        }

        // Responder con éxito independientemente del envío de correo
        res.status(200).json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: `Error al eliminar el producto: ${error.message}` });
    }
};


// Obtener productos por categoría
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

// Obtener productos en oferta
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

// Buscar productos por nombre
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
