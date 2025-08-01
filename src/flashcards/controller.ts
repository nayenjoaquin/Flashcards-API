import { Request, Response } from "express";
import { pool } from "../shared/db"
import { buildCardQuery } from "../shared/queries";
import { log } from "console";
import { CardSchema } from "../shared/schemas";
import { verifyAuthorization } from "../shared/utils";

export const getFlashcards = async (req: Request, res: Response) => {

    const { did, page = -1, limit = 10 } = req.query;
    
    const l = parseInt(limit as string);
    const p = parseInt( page as string);
    const offset = (p - 1) * l;


    const query = `${buildCardQuery('flashcard')}
    ${did ? `WHERE fc.deck_id = '${did}'` : ''}
    ORDER BY fc.created_at DESC
    ${p==-1 ?';':`LIMIT ${limit} OFFSET ${offset};`}`;
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
        res.status(201).send(result.rows[0])
    }catch(err: any){
        console.error(q);
        
        res.status(500).send({
            error: 'Failed to insert card to the database',
            details: err
        })
    }

}

export const deleteCard = async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = verifyAuthorization(req, res);
     if (!user) res.status(401).send({
        error: 'Unauthorized',
        details: 'You must be logged in to access this resource'
    });

    const query = `
    DELETE FROM flashcard
    USING deck
    WHERE flashcard.deck_id = deck.id
    AND flashcard.id = '${id}'
    AND deck.user_id = '${user?.id}';`;

    console.log('executing query: ', query);

    try{
        const result = await pool.query(query);

        if(result.rowCount==0) res.status(404).send('Card not found in the database, please verify the id');
        res.status(204).send();
    }catch(err){
        res.status(500).send({
            error: 'Internal server error',
            details: err
        });
    }
    


}