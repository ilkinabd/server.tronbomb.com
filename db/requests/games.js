module.exports = {
  'add': `
      INSERT INTO "games" (
          "game_id",
          "contract_id",
          "finish_block"
      ) VALUES (
          $gameId,
          $contractId,
          $finishBlock
      )
      ON CONFLICT ON CONSTRAINT "games_pkey"
      DO NOTHING
      RETURNING "game_id" as "id";`,

  'set-finish': `
      UPDATE "games"
      SET ("result", "status") = ($result, 'finish')
      WHERE "game_id" = $gameId;`,

  'get-by-limit': `
      SELECT * FROM "games"
      ORDER BY "game_id" DESC
      LIMIT $limit;`,
};
