import UserManager from '../managers/UserManager.js';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/utils.js';

// registrar usuario
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const existingUser = await UserManager.registerUser({ name, email, password, role });
        const token = generateToken({
            _id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
        });

        res.status(201).json({ token, user: existingUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
    }
};

//  iniciar sesión
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email o contraseña inválidos' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email o contraseña inválidos' });
        }

        user.last_login = Date.now();
        await user.save();

        const token = generateToken({
            _id: user._id,
            email: user.email,
            role: user.role,
        });

        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
    }
};
