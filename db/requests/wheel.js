module.exports = {
  'add': `
      INSERT INTO "wheel" (
          "index",
          "finish_block",
          "user_id",
          "bet",
          "token_id",
          "sector"
      ) VALUES (
          $index,
          $finishBlock,
          $userId,
          $bet,
          $tokenId,
          $sector
      ) RETURNING "time" as "value";`,

  'set-finish': `
      UPDATE "wheel"
      SET ("result", "status", "prize") = ($result, 'finish', $prize)
      WHERE "index" = $index;`,

  'set-confirm': `
      UPDATE "wheel"
      SET "confirmed" = TRUE
      WHERE "index" = $index;`,

  'get-bet-sum': `
      SELECT COALESCE(SUM("bet"), 0) AS "value"
      FROM "wheel";`,

  'get-prize-sum': `
      SELECT COALESCE(SUM("prize"), 0) AS "value"
      FROM "wheel";`,

  'get-profit': `
      SELECT COALESCE(SUM("bet") - SUM("prize"), 0) AS "value"
      FROM "dice"
      WHERE "time" > NOW() - ($interval / 1000) * INTERVAL '1 seconds';`,

  'get-by-status': `
      SELECT
          "index",
          "finish_block" as "finishBlock",
          "wallet",
          "level",
          "bet",
          "SYMBOL" as "symbol",
          "sector",
          "result",
          "prize"
      FROM "wheel"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "status" = $status;`,

  'get-by-wallet': `
      SELECT
          "index",
          "finish_block" as "finishBlock",
          "wallet",
          "level",
          "bet",
          "SYMBOL" as "symbol",
          "sector",
          "result",
          "prize",
          "time"
      FROM "wheel"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "wallet" = $wallet
      ORDER BY "index" DESC;`,

  'get-by-limit': `
      SELECT
          "index",
          "finish_block" as "finishBlock",
          "wallet",
          "level",
          "bet",
          "SYMBOL" as "symbol",
          "sector",
          "result",
          "prize",
          "time"
      FROM "wheel"
      NATURAL JOIN "users"
      NATURAL JOIN "tokens"
      WHERE "status" = 'finish'
      ORDER BY "index" DESC
      LIMIT $limit;`,
};
