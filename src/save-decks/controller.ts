import { Request, Response } from "express";
import { verifyJWT } from "../shared/utils";
import { uuidSchema } from "../shared/schemas";
import { pool } from "../shared/db";
import { buildDeckQuery } from "../shared/queries";

export const saveDeck = async (req: Request, res: Response) => {
    const { deck_id } = req.params;
    const authHeader = req.headers.authorization;
    let user = null;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        try{
            const {id, created_at, updated_at, username, email, password} = verifyJWT(token) as User;
            user = {
                id,
                created_at,
                updated_at,
                username,
                email,
                password
            };
        }catch(err){
            console.error('Invalid auth token:', err);
            res.status(401).send({
                error: 'Unauthorized',
                details: 'Invalid token'
            });
            return;
        }
    }
    const {error, value} = uuidSchema.validate(deck_id);
    if (error) {
        res.status(400).send({
            error: 'Invalid deck ID, please provide a valid UUID',
            details: error.details
        });
    }
    const q = `
    INSERT INTO saved (user_id, deck_id)
    VALUES ('${user?.id}', '${value}')
    RETURNING *;`;

    try{
        const result = await pool.query(q);
        if (result.rowCount === 0) {
            throw new Error('Error saving deck: No rows inserted');
        }
        res.status(201).send({
            message: 'Deck saved successfully',
            data: result.rows[0]
        });
    }catch (error: any) {
        console.error('Error saving deck:', error);
        res.status(500).send({
            error: 'Failed to save deck',
            details: error
        });
    }
}

export const getMyDecks = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
     let user = null;
    if(authHeader){
        const token = authHeader.split(' ')[1];
       
        try{
            const {id, created_at, updated_at, username, email, password} =verifyJWT(token) as User;
            user = {
                id,
                created_at,
                updated_at,
                username,
                email,
                password
            };
        }catch(err){
            console.error('Invalid auth token:', err);
            res.status(401).send({
                error: 'Unauthorized',
                details: 'Invalid token'
            });
        }
    }

    console.log('USER ID:', user?.id);
    
    const {error, value} = uuidSchema.validate(user?.id);
    if (error) {
        res.status(400).send({
            error: 'Invalid user ID, please provide a valid UUID',
            details: error.details
        });
    }

    const q = `
    ${buildDeckQuery('deck')}
    LEFT JOIN "saved" s ON s.deck_id = d.id
    WHERE s.user_id = '${user?.id}';`;

    try{
        console.log('Executing query:', q);
        const result = await pool.query(q);
        res.send(result.rows);
    }catch (error: any) {
        console.error('Error fetching decks:', error);
        res.status(500).send({
            error: 'Failed to fetch my decks:',
            details: error
        });
    }
};

export const deleteSaved = async (req: Request, res: Response) => {
    const { deck_id } = req.params;
    const authHeader = req.headers.authorization;
    let user = null;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        try{
            const {id, created_at, updated_at, username, email, password} = verifyJWT(token) as User;
            user = {
                id,
                created_at,
                updated_at,
                username,
                email,
                password
            };
        }catch(err){
            console.error('Invalid auth token:', err);
            res.status(401).send({
                error: 'Unauthorized',
                details: 'Invalid token'
            });
            return;
        }
    }
    const {error, value} = uuidSchema.validate(deck_id);
    if (error) {
        res.status(400).send({
            error: 'Invalid deck ID, please provide a valid UUID',
            details: error.details
        });
        return;
    }
    const q = `
    DELETE FROM saved
    WHERE user_id = '${user?.id}' AND deck_id = '${value}';
    `;

    try{
        const result = await pool.query(q);
        if (result.rowCount === 0) {
            res.status(404).send({
                error: 'Deck not found',
                details: 'No saved deck found for the user'
            });
            return;
        }
        res.status(204).send();
    }catch (error: any) {
        console.error('Error forgetting deck:', error);
        res.status(500).send({
            error: 'Failed to forget deck',
            details: error
        });
    }
};
