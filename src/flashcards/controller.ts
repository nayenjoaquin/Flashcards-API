import { Request, Response } from "express";
import { pool } from "../shared/db"
import { buildCardQuery } from "../shared/queries";
import { log } from "console";
import { CardSchema } from "../shared/schemas";

export const getFlashcards = async (req: Request, res: Response) => {

    const { did, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);


    const query = `${buildCardQuery('flashcard')}
    ${did ? `WHERE fc.deck_id = '${did}'` : ''}
    ORDER BY fc.created_at DESC
    LIMIT ${limit} OFFSET ${offset};`;
    try{
        console.log('Executing query:', query);
        
        const result = await pool.query(query);
        res.send(result.rows);
    }catch (error: any) {
        console.error('Error fetching decks:', error);
        res.status(500).send({
            error: 'Failed to fetch decks:',
            details: error.message
        });
    }
};

export const createCard = async (req: Request, res: Response) => {
    const {error, value} = CardSchema.validate(req.body)

    if(error){
        res.status(400).send({
            error: 'Invalid card data',
            details: error.details
        });
    }

    const { front, back, deck_id } = value

    const q = `
    WITH inserted AS (
    INSERT INTO flashcard (front, back, deck_id)
    VALUES ('${front}', '${back}', '${deck_id}')
    RETURNING *
    )
    ${buildCardQuery('inserted')};
    `

    try{
        const result = await pool.query(q);
        res.send(result.rows[0])
    }catch(err: any){
        console.error(q);
        
        res.status(500).send({
            error: 'Failed to insert card to the database',
            details: err
        })
    }

}