import jwt from 'jsonwebtoken';
import { AuthFailureError, BadRequestError } from '../core/error.response.js';

export const verifyToken = (req, res, next)=> {
    const token = req.cookies.accessToken;
    if(!token) 
        throw new AuthFailureError('You are not authenticated!')
    jwt.verify(token, process.env.JWT_SECRET, async(error, payload) =>{
        if(error) throw new BadRequestError("You are not authenticated!");
        req.userId = payload.id;
        req.email = payload.email;
        next();
    });
}