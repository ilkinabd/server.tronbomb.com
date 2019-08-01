module.exports = {
  'add': `
        INSERT INTO "wheel_bets" (
            "game_id",
            "index",
            "user_id",
            "bet",
            "sector"
        ) VALUES (
            $gameId,
            $index,
            $userId,
            $bet,
            $sector
        ) RETURNING "bet_id" as "id";`,

  'set-prize': `
        UPDATE "wheel_bets"
        SET "prize" = $prize
        WHERE "game_id" = $gameId AND "index" = $index;`,

  'set-confirm': `
        UPDATE "dice_bets"
        SET "confirmed" = TRUE
        WHERE "game_id" = $gameId AND "index" = $index;`,

  'get-sum': `
        SELECT SUM("bet") as "value"
        FROM "wheel_bets"
        WHERE "user_id" = $userId;`,

  'get-by-game': `
        SELECT
            "index",
            "wallet",
            "level",
            "bet",
            "SYMBOL" as "symbol",
            "sector"
        FROM "wheel_bets"
        NATURAL JOIN "users"
        NATURAL JOIN "tokens"
        WHERE "game_id" = $gameId;`,
};
