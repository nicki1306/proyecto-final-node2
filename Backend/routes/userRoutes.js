import express from 'express';
import { registerUser, loginUser, getAllUsers, deleteInactiveUsers, deleteUserById } from '../controllers/UserController.js';
import passport from 'passport';
import { verifyToken, isAdmin } from '../services/utils.js';

const router = express.Router();

// Ruta de registro (acceso sin token JWT)
router.post('/register', registerUser);

// Ruta de inicio de sesión (acceso sin token JWT)
router.post('/login', loginUser);

// Ruta para obtener todos los usuarios
router.get('/', verifyToken, isAdmin, getAllUsers); 

// Ruta para eliminar usuarios inactivos
router.delete('/inactive', verifyToken, isAdmin, deleteInactiveUsers);

router.delete('/:id', verifyToken, isAdmin, deleteUserById);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/admin?token=${token}`);
});

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/success?token=${token}`);
});

export default router;
