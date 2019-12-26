CREATE OR REPLACE FUNCTION get_all_bets_by_wallet (l integer, wlt character (34))
    RETURNS TABLE (
        "index" integer, "wallet" character (34), "game" character, "finishBlock" integer, "bet" double precision, "symbol" SYMBOL, "roll" ROLL_TYPE, "result" integer, "prize" double precision, "time" timestamp without time zone
)
    AS $$
BEGIN
    RETURN QUERY (
        SELECT
            d. "index",
            u. "wallet",
            'dice'::character (34) AS "game",
            d. "finish_block" AS "finishBlock",
            d. "bet",
            d. "symbol",
            d. "roll",
            d. "result",
            d. "prize",
            d. "time"
        FROM
            "dice" d
        NATURAL JOIN "users" u
    WHERE
        d. "status" = 'finish'
        AND u.wallet = wlt
    ORDER BY
        d. "time" DESC
    LIMIT l)
UNION ALL (
    SELECT
        w. "index",
        u. "wallet",
        'wheel'::character (34) AS "game",
        w. "finish_block" AS "finishBlock",
        w. "bet",
        w. "symbol",
        'over'::ROLL_TYPE AS "roll",
        w. "result",
        w. "prize",
        w. "time"
    FROM
        "wheel" w
    NATURAL JOIN "users" u
WHERE
    w. "status" = 'finish'
    AND u.wallet = wlt
ORDER BY
    w. "time" DESC
LIMIT l)
UNION ALL (
    SELECT
        c. "index",
        u. "wallet",
        'coin'::character (34) AS "game",
        c. "finish_block" AS "finishBlock",
        c. "bet",
        c. "symbol",
        'over'::ROLL_TYPE AS "roll",
        c. "result",
        c. "prize",
        c. "time"
    FROM
        "coin" c
    NATURAL JOIN "users" u
WHERE
    c. "status" = 'finish'
    AND u.wallet = wlt
ORDER BY
    c. "time" DESC
LIMIT l);
END;
$$
LANGUAGE 'plpgsql';

