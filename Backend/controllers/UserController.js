import UserManager from '../managers/UserManager.js';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/utils.js';

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        const savedUser = await newUser.save();

        const token = generateToken({
            _id: savedUser._id,
            email: savedUser.email,
            role: savedUser.role,
        });

        res.status(201).json({ token, user: savedUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
    }
};
