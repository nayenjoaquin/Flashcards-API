import { Request, Response } from "express";
import { pool } from "../shared/db"
import { deckIdSchema, deckSchema } from "../shared/schemas";
import { buildDeckQuery } from "../shared/queries";
import { log } from "console";

export const getDecks = async (req: Request, res: Response) => {

    const { uid, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);


    const query = `${buildDeckQuery('deck')}
    ${uid ? `WHERE d.user_id = '${uid}'` : ''}
    ORDER BY d.created_at DESC
    LIMIT ${limit} OFFSET ${offset};`;
    try{
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

export const getDeckById = async (req: Request, res: Response) => {

    const { id } = req.params;

    const {error, value} = deckIdSchema.validate(id);
    if (error) {
        res.status(400).send({
            error: 'Invalid deck ID',
            details: error.details
        });
        return;
    }

    const q = `${buildDeckQuery('deck')} WHERE d.id = '${id}';`;

    try{
        const result = await pool.query(q);
        res.send(result.rows[0]);
    }catch (error: any) {
        console.error('Error fetching deck by ID:', error);
        res.status(500).send({
            error: 'Failed to fetch deck by ID:',
            details: error.message
        });
    }
};

export const createDeck = async (req: Request, res: Response)  => {

    const {error, value} = deckSchema.validate(req.body);
    if (error) {
            res.status(400).send({
            error: 'Invalid deck data',
            details: error.details
        });
    }


    const { name, description, visibility, user_id } = value;
    const query = `
    WITH inserted AS (
    INSERT INTO deck (name, description, visibility, user_id)
    VALUES ('${name}', '${description}', '${visibility}', '${user_id}')
    RETURNING *
    )
    ${buildDeckQuery('inserted')};
    `;
    try {
        console.log('Executing query:', query);
        
        const result = await pool.query(query)
        res.send(result.rows[0]);
    } catch (error: any) {
        console.error('Error creating deck:', error);
        res.status(500).send({
            error: 'Failed to create deck',
            details: error.message
        });
    }

}