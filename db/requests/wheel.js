module.exports = {
  'add': `
      INSERT INTO "wheel" (
          "index",
          "finish_block",
          "user_id",
          "bet",
          "symbol",
          "sector"
      ) VALUES (
          $index,
          $finishBlock,
          ADD_WALLET($wallet),
          $bet,
          $symbol,
          $sector
      ) RETURNING "game_id" AS "id";`,

  'set-finish': `
      UPDATE "wheel"
      SET ("result", "status", "prize") = ($result, 'finish', $prize)
      WHERE "index" = $index;`,

  'set-confirm': `
      UPDATE "wheel" SET "confirmed" = TRUE
      WHERE "index" = $index;`,

  'get-bet-count': `
      SELECT COUNT("bet")::FLOAT AS "value"
      FROM "wheel";`,

  'get-prize-sum': `
      SELECT COALESCE(SUM("prize"), 0) AS "value"
      FROM "wheel";`,

  'get-profit': `
      SELECT COALESCE(SUM("bet") - SUM("prize"), 0) AS "value"
      FROM "wheel"
      WHERE "confirmed" = TRUE  
      AND "time" > NOW() - ($interval / 1000) * INTERVAL '1 seconds';`,

  'get-by-status': `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "bet",
          "sector"
      FROM "wheel"
      NATURAL JOIN "users"
      WHERE "status" = $status AND "finish_block" <= $currentBlock;`,

  'get-by-wallet': `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "sector",
          "result",
          "prize",
          "time"
      FROM "wheel"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet
      ORDER BY "index" DESC;`,

  'get-by-limit': `
      SELECT
          "index",
          "finish_block" AS "finishBlock",
          "wallet",
          "bet",
          "symbol",
          "sector",
          "result",
          "prize",
          "time"
      FROM "wheel"
      NATURAL JOIN "users"
      WHERE "status" = 'finish' AND "bet" > 0
      ORDER BY "index" DESC
      LIMIT $limit;`,
};
