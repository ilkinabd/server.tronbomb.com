module.exports = {
  'add': `
        INSERT INTO "dice" ("index", "finish_block")
        VALUES ($index, $finishBlock)
        RETURNING "game_id" as "id";`,

  'set-finish': `
        UPDATE "dice"
        SET ("result", "status") = ($result, 'finish')
        WHERE "index" = $index;`,

  'set-confirm': `
        UPDATE "dice"
        SET "confirmed" = TRUE
        WHERE "index" = $index;`,

  'get-id': `
        SELECT "game_id" as "id"
        FROM "dice"
        WHERE "index" = $index;`,

  'get-by-index': `
        SELECT
            "dice"."game_id" as "gameId",
            "finish_block" as "finishBlock",
            "result",
            "wallet",
            "level",
            "bet",
            "SYMBOL" as "symbol",
            "number",
            "roll",
            "prize"
        FROM "dice"
        LEFT JOIN "dice_bets" ON "dice"."game_id" = "dice_bets"."game_id"
        NATURAL JOIN "users"
        NATURAL JOIN "tokens"
        WHERE "index" = $index;`,

  'get-by-finish-block': `
        SELECT
            "dice"."game_id" as "gameId",
            "index",
            "wallet",
            "bet",
            "SYMBOL" as "symbol",
            "number",
            "roll"
        FROM "dice"
        LEFT JOIN "dice_bets" ON "dice"."game_id" = "dice_bets"."game_id"
        NATURAL JOIN "users"
        NATURAL JOIN "tokens"
        WHERE "status" = 'start' AND "finish_block" = $finishBlock;`,

  'get-by-limit': `
        SELECT
            "dice"."game_id" as "gameId",
            "finish_block" as "finishBlock",
            "result",
            "wallet",
            "level",
            "bet",
            "SYMBOL" as "symbol",
            "number",
            "roll",
            "prize"
        FROM "dice"
        LEFT JOIN "dice_bets" ON "dice"."game_id" = "dice_bets"."game_id"
        NATURAL JOIN "users"
        NATURAL JOIN "tokens"
        WHERE "status" = 'finish'
        ORDER BY "dice"."game_id" DESC
        LIMIT $limit;`,
};
