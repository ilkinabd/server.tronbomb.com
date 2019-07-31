module.exports = {
  'add': `
      INSERT INTO "games" (
          "index",
          "finish_block",
          "contract_id",
          "result"
      ) VALUES (
          $index,
          $finishBlock,
          $contractId,
          $result
      )
      RETURNING "game_id" as "id";`,

  'set-finish': `
      UPDATE "games"
      SET ("result", "status") = ($result, 'finish')
      WHERE
          "index" = $index AND
          "contract_id" = $contractId;`,

  'set-confirm': `
      UPDATE "games"
      SET "confirmed" = TRUE
      WHERE "index" = $index;`,

  'get-id': `
      SELECT "game_id" as "id"
      FROM "games"
      WHERE
          "index" = $index AND
          "contract_id" = $contractId;`,

  'get-by-finish-block': `
      SELECT
          "game_id" as "gameId",
          "index",
          "bet",
          "params",
          "wallet",
          "SYMBOL" as "symbol"
      FROM "bets"
      NATURAL JOIN "games"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "status" = 'start' AND "finish_block" = $finishBlock;`,

  'get-by-limit': `
        SELECT
            "game_id" as "gameId",
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
        NATURAL JOIN "dice_bets"
        NATURAL JOIN "users"
        NATURAL JOIN "tokens"
        WHERE "status" = 'finish'
        ORDER BY "game_id" DESC
        LIMIT $limit;`,
};
