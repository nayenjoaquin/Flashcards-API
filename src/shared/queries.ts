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

export const buildCardQuery = (table: string) => `
        SELECT
        fc.id,
        fc.created_at,
        fc.updated_at,
        fc.front,
        fc.back
        FROM ${table} fc`;

export const buildUserQuery = (table: string) => `
    SELECT
    u.id,
    u.created_at,
    u.updated_at,
    u.username,
    u.email,
    u.password
    FROM ${table} u
`;

export const buildProgressQuery = (table: string) => `
    SELECT
    p.user_id,
    p.card_id,
    p.i,
    p.n,
    p.ef,
    p.due_date
    FROM ${table} p
`;