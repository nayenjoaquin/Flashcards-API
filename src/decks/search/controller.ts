import { Request, Response } from "express";
import { buildDeckQuery } from "../../shared/queries";
import { pool } from "../../shared/db";
import { error, log } from "console";
import { verifyAuthorization } from "../../shared/utils";

export const searchDeck = async ( req: Request, res: Response) => {
    const {search} = req.query;
    const user = verifyAuthorization(req, res);
    if (!user) res.status(401).send({
        error: 'Unauthorized',
        details: 'You must be logged in to access this resource'
    });

    const q = `
        ${buildDeckQuery('deck', user!.id)}
        WHERE LOWER(d.name) LIKE LOWER('%${search}%')
    `;

    try{
        const result = await pool.query(q);
        if (result.rows.length==0){
            res.status(404).send({
                error: 'No deck matches the provided search key'
            })
        }

        res.send(result.rows);

    }catch(err){
        console.log(err);
        
        res.status(500).send({
            error: 'Internal server error',
            details: err
        })
        
    }
    

}