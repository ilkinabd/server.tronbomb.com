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
        UPDATE "wheel_bets"
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
            "prize",
            "SYMBOL" as "symbol",
            "sector"
        FROM "wheel_bets"
        NATURAL JOIN "users"
        NATURAL JOIN "tokens"
        WHERE "game_id" = $gameId;`,

  'get-wallet-history': `
        SELECT
            "time",
            "sector",
            "result",
            "finish_block" as "finishBlock",
            "bet",
            "prize"
        FROM "wheel_bets"
        LEFT JOIN "wheel" ON "wheel_bets"."game_id" = "wheel"."game_id"
        NATURAL JOIN "users"
        WHERE "wallet" = $wallet;`,
};
