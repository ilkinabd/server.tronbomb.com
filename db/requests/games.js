module.exports = {
  'add': `
      INSERT INTO "games" (
          "game_id",
          "contract_id",
          "finish_block",
          "result",
          "status"
      ) VALUES (
          $gameId,
          $contractId,
          $finishBlock,
          $result,
          $status
      )
      ON CONFLICT ON CONSTRAINT "games_pkey"
      DO UPDATE
          SET("result", "status") = ($result, $status)
      RETURNING "game_id" as "id";`,

  'set-finish': `
      UPDATE "games"
      SET ("result", "status") = ($result, 'finish')
      WHERE
          "game_id" = $gameId AND
          "contract_id" = $contractId;`,

  'get-by-limit': `
      SELECT * FROM "games"
      WHERE "contract_id" = $contractId
      ORDER BY "game_id" DESC
      LIMIT $limit;`,
};
