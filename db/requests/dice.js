module.exports = {
  'add': `
      INSERT INTO "dice" (
          "index",
          "finish_block",
          "user_id",
          "bet",
          "token_id",
          "number",
          "roll"
      ) VALUES (
          $index,
          $finishBlock,
          $userId,
          $bet,
          $tokenId,
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

  'get-bet-sum': `
      SELECT COALESCE(SUM("bet"), 0) AS "value"
      FROM "dice";`,

  'get-prize-sum': `
      SELECT COALESCE(SUM("prize"), 0) AS "value"
      FROM "dice";`,

  'get-profit': `
      SELECT COALESCE(SUM("bet") - SUM("prize"), 0) AS "value"
      FROM "dice"
      WHERE "time" > NOW() - ($interval / 1000) * INTERVAL '1 seconds';`,

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
          "prize",
          "time"
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
          "prize",
          "time"
      FROM "dice"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "wallet" = $wallet
      ORDER BY "index" DESC;`,

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
          "prize",
          "time"
      FROM "dice"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "status" = 'finish'
      ORDER BY "index" DESC
      LIMIT $limit;`,
};
