module.exports = {
  'add': `
      INSERT INTO "games" (
          "index",
          "finish_block",
          "result",
          "status"
      ) VALUES (
          $index,
          $finishBlock,
          $result,
          $status
      )
      ON CONFLICT ON CONSTRAINT "games_index_contract_id_key"
      DO UPDATE
          SET("result", "status") = ($result, $status)
      RETURNING "game_id" as "id";`,

  'set-finish': `
      UPDATE "games"
      SET ("result", "status") = ($result, 'finish')
      WHERE
          "index" = $index AND
          "contract_id" = $contractId;`,

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
      SELECT * FROM "games"
      WHERE "contract_id" = $contractId
      ORDER BY "index" DESC
      LIMIT $limit;`,
};
