import express from 'express';
import UserManager from '../controllers/UserController.js';
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const newUser = await UserManager.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { user, token } = await UserManager.authenticateUser(req.body.email, req.body.password);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

