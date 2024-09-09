import express from 'express';
import { registerUser, loginUser } from '../controllers/UserController.js';
import passport from 'passport';

const router = express.Router();

// Ruta de registro (acceso sin token JWT)
router.post('/register', registerUser);

// Ruta de inicio de sesión (acceso sin token JWT)
router.post('/login', loginUser);

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
