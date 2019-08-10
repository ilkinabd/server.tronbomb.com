module.exports = {
  'add': `
      INSERT INTO "dice" (
          "index",
          "finish_block",
          "user_id",
          "bet",
          "number",
          "roll"
      ) VALUES (
          $index,
          $finishBlock,
          $userId,
          $bet,
          $number,
          $roll
      ) RETURNING "game_id" as "id";`,

  'set-finish': `
      UPDATE "dice"
      SET ("result", "status", "prize") = ($result, 'finish', $prize)
      WHERE "index" = $index;`,

  'set-confirm': `
      UPDATE "dice"
      SET "confirmed" = TRUE
      WHERE "index" = $index;`,

  'get-by-index': `
      SELECT
          "index",
          "finish_block" as "finishBlock",
          "wallet",
          "level",
          "bet",
          "SYMBOL" as "symbol",
          "number",
          "roll",
          "result",
          "prize"
      FROM "dice"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "index" = $index;`,

  'get-by-wallet': `
      SELECT
          "index",
          "finish_block" as "finishBlock",
          "wallet",
          "level",
          "bet",
          "SYMBOL" as "symbol",
          "number",
          "roll",
          "result",
          "prize"
      FROM "dice"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "wallet" = $wallet;`,

  'get-by-finish-block': `
      SELECT
          "index",
          "wallet",
          "bet",
          "number",
          "roll"
      FROM "dice"
      NATURAL JOIN "users"
      WHERE "status" = 'start' AND "finish_block" = $finishBlock;`,

  'get-by-limit': `
      SELECT
          "index",
          "finish_block" as "finishBlock",
          "wallet",
          "level",
          "bet",
          "SYMBOL" as "symbol",
          "number",
          "roll",
          "result",
          "prize"
      FROM "dice"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "status" = 'finish'
      ORDER BY "dice"."game_id" DESC
      LIMIT $limit;`,
};
