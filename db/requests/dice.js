module.exports = {
  'add': `
      INSERT INTO "dice" (
          "index",
          "finish_block",
          "user_id",
          "bet",
          "symbol",
          "number",
          "roll"
      ) VALUES (
          $index,
          $finishBlock,
          ADD_WALLET($wallet),
          $bet,
          $symbol,
          $number,
          $roll
      ) RETURNING "game_id" AS "id";`,

  'set-finish': `
      UPDATE "dice"
      SET ("result", "status", "prize") = ($result, 'finish', $prize)
      WHERE "index" = $index;`,

  'set-confirm': `
      UPDATE "dice"
      SET "confirmed" = TRUE
      WHERE "index" = $index;`,

  'get-bet-count': `
      SELECT COUNT("bet")::FLOAT AS "value"
      FROM "dice";`,

  'get-prize-sum': `
      SELECT COALESCE(SUM("prize"), 0) AS "value"
      FROM "dice";`,

  'get-profit': `
      SELECT COALESCE(SUM("bet") - SUM("prize"), 0) AS "value"
      FROM "dice"
      WHERE "time" > NOW() - ($interval / 1000) * INTERVAL '1 seconds';`,

  'get-by-wallet': `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "number",
          "roll",
          "result",
          "prize",
          "time"
      FROM "dice"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet
      ORDER BY "time" DESC;`,

  'get-by-finish-block': `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "number",
          "roll",
          "time"
      FROM "dice"
      NATURAL JOIN "users"
      WHERE "status" = 'start' AND "finish_block" = $finishBlock;`,

  'get-non-finished': `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "number",
          "roll",
          "time"
      FROM "dice"
      NATURAL JOIN "users"
      WHERE "result" IS NULL;`,

  'get-by-limit': `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "number",
          "roll",
          "result",
          "prize",
          "time"
      FROM "dice"
      NATURAL JOIN "users"
      WHERE "status" = 'finish'
      ORDER BY "time" DESC
      LIMIT $limit;`,
};
