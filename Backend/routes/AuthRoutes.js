// backend/routes/authRoutes.js
import express from 'express';
import User from '../models/UserModel.js';
import { createHash, isValidPassword, createToken } from '../services/utils.js';

const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = createHash(password);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !isValidPassword(user, password)) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }
        const token = createToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
});

export default router;
