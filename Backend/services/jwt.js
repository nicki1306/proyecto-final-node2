import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    const secret = process.env.JWT_SECRET || 'mysecret';
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
});
};
