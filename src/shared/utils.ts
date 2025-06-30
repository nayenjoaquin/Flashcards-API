import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {StringValue} from 'ms';

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed

}

export const verifyPassword = async (password: string, hashed: string) => {
    const match = await bcrypt.compare(password, hashed);
    return match;
}

const SECRET_KEY = process.env.JWT_SECRET || 'This is a placeholder';

export const generateJWT = (payload: Object, expiresIn: StringValue = '30d')=>{
    return jwt.sign(payload,SECRET_KEY,{
        expiresIn: expiresIn
    })
}

export const verifyJWT = (token: string) =>{
    const SECRET_KEY = process.env.JWT_SECRET || 'This is a plceholder';

    return jwt.verify(token, SECRET_KEY);

}
export const verifyAuthorization = (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    let user;
    if (!authHeader) {
        console.error("Authorization header is missing");
        
        res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader!.split(" ")[1];
    if (!token) {
        console.error("Token is missing from the authorization header");
        res.status(401).json({ error: "Unauthorized" });
    }
    try {
        user = verifyJWT(token) as User;
        return user;
    } catch (error) {
        console.error("Invalid token", error);
        res.status(401).json({ error: "Unauthorized" });
    }
}

