import { Request, Response } from "express";
import { pool } from "../shared/db"

export const getDecks = async (req: Request, res: Response) => {
    const query = `SELECT
    d.id,
    d.created_at,
    d.updated_at,
    d.name,
    d.description,
    d.visibility,
    d.saved,
    u.username AS owner
    FROM deck d
    JOIN "user" u ON d.user_id = u.id
    ORDER BY d.created_at DESC;`;
    try{
        const result = await pool.query(query);
        res.json(result.rows);
    }catch (error) {
        console.error('Error fetching decks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};