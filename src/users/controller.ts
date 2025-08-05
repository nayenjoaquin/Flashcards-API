import { Request, Response } from "express";
import { UserSchema } from "../shared/schemas";
import { buildUserQuery } from "../shared/queries";
import { pool } from "../shared/db";
import { generateJWT, hashPassword, verifyJWT, verifyPassword } from "../shared/utils";
import { error } from "console";

export const createUser = async(req: Request, res:  Response) => {
    const {error, value} = UserSchema.validate(req.body);
    if(error){
        res.status(400).send({
            error: 'Invalid user data',
            details: error
        })
    }
    const {username, email, password} = value

    const hashedPassword = await hashPassword(password);

    const q=`
    WITH  inserted AS (
    INSERT INTO "user" (username, email, password)
    VALUES
    ('${username}', '${email}', '${hashedPassword}')
    RETURNING *
    )

    ${buildUserQuery('inserted')};
    `;

    try{
        const result = await pool.query(q);

        const newUser = result.rows[0];

        const token = generateJWT(newUser as User, '30d');

        res.status(201).send({
            data: newUser,
            token: token
        })
    }catch(err){
        
        res.status(500).send({
            error: 'Failed to create user in the database',
            details: err
        })
    }
}

export const signIn = async(req: Request, res: Response) => {

    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        try{
            const {id, created_at, updated_at, username, email, password} =verifyJWT(token) as User;
            const user = {
                id,
                created_at,
                updated_at,
                username,
                email,
                password
            }
            
            res.send({
                data: user,
                token: generateJWT({
                    ...user
                } as User, '30d')
            })
        }catch(err){
            console.error(err);
            
            res.status(400).send({
                error:'Invalid Authorization token',
                details: err
            });
        }
        



    }
    const {email, password} = req.body;

    const q = `
    ${buildUserQuery('"user"')}
    WHERE u.email = '${email}';
    `;

    try{
        const result = await pool.query(q);
        if(result.rowCount==0){
            res.status(400).send({
                message: 'Invalid user credentials'
            });
        }
        const user = result.rows[0];
        
        const match = await verifyPassword(password, user.password);

        if(!match){
            res.status(400).send({
                message: 'Invalid user credentials'
            });
        }

        res.send({
            data: user,
            token: generateJWT(user, '1d')
        });

    }catch(err){
        
        res.status(500).send(err);
    }
}