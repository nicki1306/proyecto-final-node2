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

        console.log('Usuario autenticado:', req.user);

        if (req.user.role !== 'admin') {
            console.log('Acceso no autorizado, el rol es:', req.user.role);
            return res.status(403).json({ message: 'No autorizado' });
        }

        console.log('Intentando obtener usuarios desde MongoDB...');
        const users = await User.find({}, 'name email role active last_login');

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios.' });
        }
        
        console.log('Usuarios obtenidos:', users);
        res.status(200).json({ payload: users });
    } catch (error) {
        console.error('Error capturado al obtener los usuarios:', error.message);
        console.error('Stack trace del error:', error.stack);
        res.status(500).json({ origin: 'ATLAS', payload: '', error: 'Error no identificado: ' + error.message });
    }
};

// Eliminar usuarios inactivos
export const deleteInactiveUsers = async (req, res, next) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    try {
        // Encontrar los usuarios inactivos
        const inactiveUsers = await User.find({ last_login: { $lt: twoDaysAgo } });

        if (inactiveUsers.length === 0) {
            return res.status(200).json({ message: 'No hay usuarios inactivos para eliminar.' });
        }

        // Eliminar los usuarios inactivos
        await User.deleteMany({ last_login: { $lt: twoDaysAgo } });

        // Configurar nodemailer para enviar correos
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Enviar correo a cada usuario eliminado
        for (const user of inactiveUsers) {
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: `Hola ${user.name}, tu cuenta ha sido eliminada por inactividad.`,
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: `${inactiveUsers.length} usuarios eliminados por inactividad` });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        next(error);
    }
};
