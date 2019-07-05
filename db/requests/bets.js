module.exports = {
  'add': `
      INSERT INTO "bets" (
          "game_id",
          "user_id",
          "bet",
          "params"
      ) VALUES (
          $gameId,
          $userId,
          $bet,
          $params
      ) RETURNING "bet_id" as "id";`,

  'set-prize': `
      UPDATE "bets"
      SET "prize" = $prize
      WHERE
        "game_id" = $gameId AND
        "user_id" = $userId;`,

  'get-by-limit': `
      SELECT
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
      WHERE "status" = 'finish'
      ORDER BY "bet_id" DESC
      LIMIT $limit;`,

  'get-sum': `
      SELECT SUM("bet") as "value"
      FROM "bets"
      WHERE "user_id" = $userId;`,
};
