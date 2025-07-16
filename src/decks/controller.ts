import { Request, Response } from "express";
import { pool } from "../shared/db"
import { uuidSchema, DeckSchema } from "../shared/schemas";
import { buildDeckQuery } from "../shared/queries";
import { log } from "console";
import { verifyAuthorization, verifyJWT } from "../shared/utils";

export const getDecks = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const user = verifyAuthorization(req, res);
    if (!user) res.status(401).send({
        error: 'Unauthorized',
        details: 'You must be logged in to access this resource'
    });


    const query = `${buildDeckQuery('deck', user!.id )}
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
    const user = verifyAuthorization(req, res);
    if (!user) res.status(401).send({
        error: 'Unauthorized',
        details: 'You must be logged in to access this resource'
    });

    const { id } = req.params;

    const {error, value} = uuidSchema.validate(id);
    if (error) {
        res.status(400).send({
            error: 'Invalid deck ID',
            details: error.details
        });
        return;
    }

    const q = `${buildDeckQuery('deck', user!.id)} WHERE d.id = '${id}';`;

    try{
        console.log('Executing query:', q);
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
    const user = verifyAuthorization(req, res);
    if (!user) res.status(401).send({
        error: 'Unauthorized',
        details: 'You must be logged in to access this resource'
    });

    const {error, value} = DeckSchema.validate(req.body);
    if (error) {
        res.status(400).send({
            error: 'Invalid deck data',
            details: error.details
        });
        
    }


    const { name, description, visibility } = value;
    const query = `
    WITH inserted AS (
    INSERT INTO deck (name, description, visibility, user_id)
    VALUES ('${name}', '${description}', '${visibility}', '${user!.id}')
    RETURNING *
    )
    ${buildDeckQuery('inserted', user!.id)};
    `;
    try {
        console.log('Executing query:', query);
        
        const result = await pool.query(query)
        res.send(result.rows[0]);
    } catch (error: any) {
        console.error('Error creating deck:', error);
        res.status(500).send({
            error: 'Failed to create deck',
            details: error
        });
    }

}

export const deleteDeck = async (req: Request, res: Response) => {
    const {id} = req.params
    const {value, error} = uuidSchema.validate(id);
    if(error){
        res.status(400).send({
            error: 'Invalid deck Id',
            details: error.details
        });
    }

    const q = `DELETE from deck
    WHERE id = '${id}';`;

    try{
        const result = await pool.query(q);
        console.log(result.rowCount);
        if(result.rowCount==0){
            res.status(404).send({
                details: 'Deck not found in the database. Please verify the id'
            })
        }
        res.status(204).send();
    }catch(err: any){
        res.status(500).send({
            error: 'failed to delete deck from database',
            details: err
        });
    }
}