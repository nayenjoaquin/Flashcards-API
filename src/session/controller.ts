import { Request, Response } from "express";
import { verifyAuthorization } from "../shared/utils";
import { SessionSchema } from "../shared/schemas";
import { buildSessionQuery } from "../shared/queries";
import { pool } from "../shared/db";


export const saveSession = async(req: Request, res: Response) => {
    const user = verifyAuthorization(req, res);
    const {error, value} = SessionSchema.validate({
        ...req.body,
        user_id: user?.id
    })

    if(error){
        res.status(400).send({
            error: 'Invalid session data',
            details: error
        })
    }
    const {deck_id, wrong, good, perfect, duration} = value
    const q = `
    WITH inserted AS (
    INSERT INTO session(deck_id, user_id, wrong, good, perfect, duration)
    VALUES ('${deck_id}', '${user?.id}', ${wrong}, ${good}, ${perfect}, ${duration})
    RETURNING *
    )
    ${buildSessionQuery('inserted')};
    `;

    console.log('query: ', q);
    
    try{
        const result = await pool.query(q);

        res.status(201).send(result.rows);
    }catch(error){
        res.status(500).send({
            error: 'Internal server error',
            details: error
        })
    }
}