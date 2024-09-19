import UserManager from '../managers/UserManager.js';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/utils.js';
import nodemailer from 'nodemailer';

// registrar usuario
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const existingUser = await UserManager.registerUser({ name, email, password, role });

        console.log('Usuario registrado:', existingUser);
        if (!existingUser._id) {
            throw new Error('El _id del usuario no se generó correctamente');
        }

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

// iniciar sesion

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    try {

        const { user, token } = await UserManager.authenticateUser(email, password);

        console.log('Usuario autenticado:', user);
        if (!user._id) {
            throw new Error('El _id del usuario no se generó correctamente');
        }


        user.last_login = Date.now();
        await user.save();

        res.status(200).json({ user, token });
    } catch (error) {

        console.error('Error durante el inicio de sesión:', error.message);
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ message: 'Email o contraseña inválidos' });
        }
        res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Eliminar usuarios inactivos
export const deleteInactiveUsers = async (req, res) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    try {
        // Encontrar los usuarios inactivos
        const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });

        if (inactiveUsers.length === 0) {
            return res.status(200).json({ message: 'No hay usuarios inactivos para eliminar.' });
        }

        // Eliminar los usuarios inactivos
        await User.deleteMany({ lastLogin: { $lt: twoDaysAgo } });

        // Configurar nodemailer para enviar correos
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tu-correo@gmail.com',
                pass: 'tu-contraseña',
            },
        });

        // Enviar correo a cada usuario eliminado
        for (const user of inactiveUsers) {
            const mailOptions = {
                from: 'tu-correo@gmail.com',
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: `Hola ${user.name}, tu cuenta ha sido eliminada por inactividad.`,
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: `${inactiveUsers.length} usuarios eliminados por inactividad` });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos', error });
    }
};
