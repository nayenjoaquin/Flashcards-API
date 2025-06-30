import { Request, Response } from "express";
import { verifyAuthorization } from "../shared/utils";
import { buildSessionQuery } from "../shared/queries";
import { pool } from "../shared/db";

export const getLastReview = async(req: Request, res: Response)=>{
    const user =verifyAuthorization(req, res);

    const q = `
    ${buildSessionQuery('session')}
    WHERE s.user_id = '${user?.id}'
    ORDER BY created_at DESC
    LIMIT 1;
    `;

    try{
        const result = await pool.query(q);

        if(result.rows.length==0){
            res.status(404).send([]);
        }

        res.send(result.rows[0])

    }catch(err){
        res.status(500).send({
            error: 'Internal server error',
            details: err
        })
    }

}