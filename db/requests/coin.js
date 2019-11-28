module.exports = {
  add: `
    INSERT INTO "coin" (
        "index",
        "finish_block",
        "user_id",
        "bet",
        "symbol",
        "number"
    ) VALUES (
        $index,
        $finishBlock,
        ADD_WALLET($wallet),
        $bet,
        $symbol,
        $number
    ) RETURNING "game_id" AS "id";`,

  "set-finish": `
    UPDATE "coin"
    SET ("result", "status", "prize") = ($result, 'finish', $prize)
    WHERE "index" = $index;`,

  "set-confirm": `
    UPDATE "coin"
    SET "confirmed" = TRUE
    WHERE "index" = $index;`,

  "get-by-finish-block": `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "number",
          "time"
      FROM "coin"
      NATURAL JOIN "users"
      WHERE "status" = 'start' AND "finish_block" = $finishBlock;`,

  "get-non-finished": `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "number",
          "time"
      FROM "coin"
      NATURAL JOIN "users"
      WHERE "result" IS NULL AND ("time" + INTERVAL '2 minutes') < NOW();`
};
