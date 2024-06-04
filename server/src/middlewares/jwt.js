import jwt from 'jsonwebtoken';
import { BadRequestError } from '../core/error.response.js';

export const verifyToken = (req, res, next)=> {
    const token = req.cookies.accessToken;
    if(!token) 
        return next(createError(401, "You are not authenticated!"));
    jwt.verify(token, process.env.JWT_SECRET, async(error, payload) =>{
        if(error) throw new BadRequestError("You are not authenticated!");
        req.userId = payload.id;
        req.email = payload.email;
        next();
    });
}