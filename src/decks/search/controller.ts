import { Request, Response } from "express";
import { buildDeckQuery } from "../../shared/queries";
import { pool } from "../../shared/db";
import { error } from "console";

export const searchDeck = async ( req: Request, res: Response): Promise<void> => {
    const {search} = req.query;

    const q = `
        ${buildDeckQuery('deck')}
        WHERE LOWER(d.name) LIKE LOWER('%${search}%')
    `;
    console.log(q);
    

    try{
        const result = await pool.query(q);
        if (result.rows.length==0){
            res.status(404).send({
                error: 'No deck matches the provided search key'
            })
            return;
        }

        res.send(result.rows);

    }catch(err){
        console.error(err);
        
    }
    

}