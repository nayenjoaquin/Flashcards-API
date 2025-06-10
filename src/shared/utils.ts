import bcrypt from 'bcrypt';
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

