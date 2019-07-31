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
      UPDATE "bets"
      SET "prize" = $prize
      WHERE
        "game_id" = $gameId AND
        "user_id" = $userId;`,

  'set-confirm': `
      UPDATE "bets"
      SET "confirmed" = TRUE
      WHERE "game_id" = $gameId AND "user_id" = $userId;`,

  'get-by-index': `
      SELECT
          "game_id" as "gameId",
          "bet",
          "prize",
          "params",
          "finish_block" as "finishBlock",
          "result",
          "wallet",
          "level",
          "SYMBOL" as "symbol"
      FROM "bets"
      NATURAL JOIN "games"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "status" = 'finish' AND "index" = $index;`,

  'get-sum': `
        SELECT SUM("bet") as "value"
        FROM "dice_bets"
        WHERE "user_id" = $userId;`,
};
