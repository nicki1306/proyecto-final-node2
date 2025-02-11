import express from 'express';
import { registerUser, loginUser, getAllUsers, deleteInactiveUsers, deleteUserById, updateUserRoleById } from '../controllers/UserController.js';
import passport from 'passport';
import { verifyToken, isAdmin } from '../services/utils.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

// Ruta para obtener todos los usuarios
router.get('/', verifyToken, isAdmin, getAllUsers); 

// Ruta para eliminar usuarios inactivos
router.delete('/inactive', verifyToken, isAdmin, deleteInactiveUsers);

router.delete('/:id', verifyToken, isAdmin, deleteUserById);

router.put('/role/:id', verifyToken, isAdmin, updateUserRoleById);


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
