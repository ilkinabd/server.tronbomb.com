module.exports = {
  'add': `
        INSERT INTO "wheel" ("index", "finish_block")
        VALUES ($index, $finishBlock)
        RETURNING "game_id" as "id";`,
};
