import { Request, Response } from "express";
import { ProgressSchema } from "../shared/schemas";
import { verifyJWT } from "../shared/utils";
import { pool } from "../shared/db";
import { log } from "console";
import { buildProgressQuery } from "../shared/queries";

export const updateProgress = async (req: Request, res: Response) => {
    const { card_id } = req.params;
    const authHeader = req.headers.authorization;
    let user;
    if (!authHeader) {
        console.error("Authorization header is missing");
        
        res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader!.split(" ")[1];
    if (!token) {
        console.error("Token is missing from the authorization header");
        res.status(401).json({ error: "Unauthorized" });
    }
    try {
        user = verifyJWT(token) as User;
    } catch (error) {
        console.error("Invalid token", error);
        res.status(401).json({ error: "Unauthorized" });
    }
    const { error, value } = ProgressSchema.validate({
        ...req.body,
        card_id: card_id,
        user_id: user!.id
    });

    if (error) {
        res.status(400).json({
            error: "Invalid request data",
            details: error.details
        });
    }
    const { i, n, ef, due_date } = value;
    

    const query = `
        INSERT INTO progress (card_id, user_id, i, n, ef, due_date)
        VALUES ('${card_id}', '${user!.id}', ${i}, ${n}, ${ef}, '${due_date.toISOString()}')
        ON CONFLICT (user_id, card_id) DO UPDATE
        SET i = EXCLUDED.i,
            n = EXCLUDED.n,
            ef = EXCLUDED.ef,
            due_date = EXCLUDED.due_date,
            reviewed_at = CURRENT_TIMESTAMP
        RETURNING *;
    `;

    try{
        const result = await pool.query(query);
        if (result.rowCount == 0) {
            throw new Error("Failed to update progress");
        }
        res.status(200).json({
            message: "Progress updated successfully",
            progress: result.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error
        });
    }
}

export const getProgress = async (req: Request, res: Response) => {
    const { deck_id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader!.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
    }
    let user;
    try {
        user = verifyJWT(token) as User;
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }

    const query = `
    ${buildProgressQuery("progress")}
    JOIN "flashcard" fc ON fc.id = p.card_id
    WHERE p.user_id = '${user?.id}' AND fc.deck_id = '${deck_id}'
    `;

    try {
        log("Executing query:", query);
        const result = await pool.query(query);
        res.status(200).send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error
        });
    }
}