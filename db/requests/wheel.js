module.exports = {
  'add': `
        INSERT INTO "wheel" ("index", "finish_block")
        VALUES ($index, $finishBlock)
        RETURNING "game_id" as "id";`,

  'set-finish': `
        UPDATE "wheel"
        SET ("result", "status") = ($result, 'finish')
        WHERE "index" = $index;`,

  'set-confirm': `
        UPDATE "wheel"
        SET "confirmed" = TRUE
        WHERE "index" = $index;`,

  'get-id': `
        SELECT "game_id" as "id"
        FROM "wheel"
        WHERE "index" = $index;`,

  'get-index-by-block': `
        SELECT "index" as "value"
        FROM "wheel"
        WHERE "status" = 'start' AND "finish_block" = $finishBlock;`,

  'get-by-finish-block': `
        SELECT "game_id" as "gameId", "index"
        FROM "wheel"
        WHERE "status" = 'start' AND "finish_block" = $finishBlock;`,
};
