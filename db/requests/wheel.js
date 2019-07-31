module.exports = {
  'add': `
        INSERT INTO "wheel" ("index", "finish_block")
        VALUES ($index, $finishBlock)
        RETURNING "game_id" as "id";`,

  'get-id': `
        SELECT "game_id" as "id"
        FROM "wheel"
        WHERE "index" = $index;`,
};
