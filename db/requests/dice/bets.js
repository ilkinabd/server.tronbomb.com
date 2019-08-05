module.exports = {
  'add': `
        INSERT INTO "dice_bets" (
            "game_id",
            "user_id",
            "bet",
            "number",
            "roll"
        ) VALUES (
            $gameId,
            $userId,
            $bet,
            $number,
            $roll
        ) RETURNING "bet_id" as "id";`,

  'set-prize': `
        UPDATE "dice_bets"
        SET "prize" = $prize
        WHERE "game_id" = $gameId;`,

  'set-confirm': `
        UPDATE "dice_bets"
        SET "confirmed" = TRUE
        WHERE "game_id" = $gameId;`,

  'get-sum': `
        SELECT SUM("bet") as "value"
        FROM "dice_bets"
        WHERE "user_id" = $userId;`,

  'get-all-by-wallet': `
        SELECT
            "time",
            "roll",
            "number",
            "result",
            "finish_block" as "finishBlock",
            "bet",
            "prize"
        FROM "dice_bets"
        LEFT JOIN "dice" ON "dice_bets"."game_id" = "dice"."game_id"
        NATURAL JOIN "users"
        WHERE "wallet" = $wallet;`,
};
