module.exports = {
  'add': `
      INSERT INTO "freeze" (
          "hash",
          "user_id",
          "amount",
          "finish"
      ) VALUES (
          $hash,
          $userId,
          $amount,
          $finishTime::TIMESTAMP AT TIME ZONE 'UTC'
      ) RETURNING "tx_id" as "id";`,

  'set-complete': `
      UPDATE "freeze"
      SET "status" = 'complete'
      WHERE "tx_id" = $txId;`,

  'get-actives': `
      SELECT
          "tx_id" as "txId",
          "finish",
          "amount",
          "wallet"
      FROM "freeze"
      NATURAL JOIN "users"
      WHERE "status" = 'active';`,

  'get-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "freeze"
      WHERE "status" = 'active';`,

  'get-by-wallet': `
      SELECT
          "hash",
          "amount",
          "start",
          "finish",
          "status"
      FROM "freeze"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet
      ORDER BY "tx_id" DESC;`,

  'get-by-limit': `
      SELECT
          "hash",
          "wallet",
          "amount",
          "start",
          "finish",
          "status"
      FROM "freeze"
      NATURAL JOIN "users"
      ORDER BY "tx_id" DESC
      LIMIT $limit;`,
};
