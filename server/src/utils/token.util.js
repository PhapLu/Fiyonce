import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } // Token validity
    );
};

export {generateToken}
