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

}