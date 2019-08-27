module.exports = {
  'add': `
      INSERT INTO "freeze" (
          "hash",
          "type",
          "user_id",
          "amount"
      ) VALUES (
          $hash,
          $type,
          $userId,
          $amount
      ) RETURNING "tx_id" AS "id";`,

  'set-complete': `
      UPDATE "freeze"
      SET "status" = 'complete'
      WHERE "tx_id" = $txId;`,

  'get-awaiting': `
      SELECT
          "tx_id" AS "txId",
          "time",
          -"amount" AS "amount",
          "wallet"
      FROM "freeze"
      NATURAL JOIN "users"
      WHERE "type" = 'unfreeze' AND "status" = 'awaiting';`,

  'get-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "freeze";`,

  'get-user-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "freeze"
      WHERE "user_id" = $userId;`,

  'get-users-amounts': `
      SELECT
          "wallet",
          SUM("amount") as "amount"
      FROM "freeze"
      NATURAL JOIN "users"
      GROUP BY "wallet"`,

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
