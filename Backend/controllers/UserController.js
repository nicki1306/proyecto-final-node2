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
        // Verificar si el usuario ya existe
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

        // Guardar el nuevo usuario en la base de datos
        const savedUser = await newUser.save();

        // Generar un token JWT para el nuevo usuario
        const token = generateToken({
            _id: savedUser._id,
            email: savedUser.email,
            role: savedUser.role,
        });

        // Responder con el token y los datos del usuario
        res.status(201).json({ token, user: savedUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
    }
};

//  iniciar sesión
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validación de campos requeridos
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    try {
        // Buscar al usuario por su email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email o contraseña inválidos' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email o contraseña inválidos' });
        }

        // Generar un token JWT
        const token = generateToken({
            _id: user._id,
            email: user.email,
            role: user.role,
        });

        // Responder con el token y los datos del usuario
        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
    }
};
