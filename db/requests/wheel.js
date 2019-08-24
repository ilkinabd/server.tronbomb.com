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
      ) RETURNING "game_id" as "id";`,

  'set-finish': `
      UPDATE "wheel"
      SET ("result", "status", "prize") = ($result, 'finish', $prize)
      WHERE "index" = $index;`,

  'set-confirm': `
      UPDATE "wheel"
      SET "confirmed" = TRUE
      WHERE "index" = $index;`,

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
