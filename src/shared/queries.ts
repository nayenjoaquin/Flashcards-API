export const buildDeckQuery = (table: string) =>`
        SELECT
        d.id,
        d.name,
        d.description,
        d.visibility,
        d.saved,
        d.user_id,
        u.username AS owner
        FROM ${table} d
        JOIN "user" u ON u.id = d.user_id`;

export const buildCardQuery = (table: string) => `
        SELECT
        fc.id,
        fc.front,
        fc.back
        FROM ${table} fc`;

export const buildUserQuery = (table: string) => `
    SELECT
    u.id,
    u.username,
    u.email,
    u.password
    FROM ${table} u`;

export const buildProgressQuery = (table: string) => `
    SELECT
    p.card_id,
    p.i,
    p.n,
    p.ef,
    p.due_date,
    p.reviewed_at
    FROM ${table} p`;

    export const buildSessionQuery = (table: string)=>`
    SELECT
    s.deck_id,
    s.user_id,
    s.wrong,
    s.good,
    s.perfect,
    s.duration,
    s.created_at
    FROM ${table} s
    `;