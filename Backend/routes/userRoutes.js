import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/UserController.js';
import { generateToken } from '../services/jwt.js';

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback de Google
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    const token = generateToken(req.user);

    if(req.user.role === 'admin') {
        res.redirect(`/admin?token=${token}`);
    } else {
        res.redirect(`/products?token=${token}`);
    }
});

// Ruta para redirigir al flujo de GitHub OAuth
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback de GitHub
router.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/success?token=${token}`);
});

router.post('/register', registerUser);
router.post('/auth/login', loginUser);

export default router;

//nickii.cn@hotmail.com