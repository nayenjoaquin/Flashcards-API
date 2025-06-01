export const buildDeckQuery = (table: string) =>`
        SELECT
        d.id,
        d.created_at,
        d.updated_at,
        d.name,
        d.description,
        d.visibility,
        d.saved,
        u.username AS owner
        FROM ${table} d
        JOIN "user" u ON u.id = d.user_id
    `;