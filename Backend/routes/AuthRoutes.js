import express from 'express';
import { registerUser, loginUser } from '../controllers/UserController.js';

const router = express.Router();

// Ruta de registro
router.post('/register', registerUser);

// Ruta de inicio de sesión
router.post('/login', loginUser);

export default router;

