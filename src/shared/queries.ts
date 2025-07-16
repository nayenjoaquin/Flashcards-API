export const buildDeckQuery = (table: string, user_id: string) =>`
        SELECT
        d.id,
        d.name,
        d.description,
        d.visibility,
        d.saved,
        d.user_id,
        u.username AS owner,
        COALESCE( cards.cards, '[]') AS cards,
        progress.progress
        FROM ${table} d
        JOIN "user" u ON u.id = d.user_id
        LEFT JOIN LATERAL(SELECT
        json_agg(
                json_build_object(
                        'id', fc.id,
                        'front', fc.front,
                        'back', fc.back) ORDER BY fc.id
                ) AS cards
        FROM "flashcard" fc
        WHERE fc.deck_id = d.id) cards ON true
        LEFT JOIN LATERAL(SELECT
        json_agg(
                json_build_object(
                        'i', p.i,
                        'n', p.n,
                        'ef', p.ef,
                        'due_date', p.due_date,
                        'reviewed_at', p.reviewed_at) ORDER BY p.card_id
                ) AS progress
        FROM "progress" p
        WHERE p.card_id IN (
                SELECT fc.id FROM flashcard fc WHERE fc.deck_id = d.id
        ) AND p.user_id = '${user_id}'
        ) progress ON true`;

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