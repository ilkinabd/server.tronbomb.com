module.exports = {
  'add': `
      INSERT INTO "freeze" (
          "type",
          "user_id",
          "amount"
      ) VALUES (
          $type,
          $userId,
          $amount
      ) RETURNING "tx_id" AS "id";`,

  'cancel-all-unfreeze': `
      UPDATE "freeze"
      SET "status" = 'cancel'
      WHERE
          "type" = 'unfreeze' AND "status" = 'awaiting' AND
          "user_id" = $userId;`,

  'set-complete': `
      UPDATE "freeze"
      SET "status" = 'complete',
          "hash" = $hash
      WHERE "tx_id" = $txId;`,

  'get-awaiting': `
      SELECT
          "tx_id" AS "txId",
          "time",
          ABS("amount") AS "amount",
          "wallet"
      FROM "freeze"
      NATURAL JOIN "users"
      WHERE "type" = 'unfreeze' AND "status" = 'awaiting';`,

  'get-awaiting-by-wallet': `
      SELECT
          "time",
          ABS("amount") AS "amount"
      FROM "freeze"
      WHERE
          "type" = 'unfreeze' AND "status" = 'awaiting' AND
          "user_id" = GET_USER_ID($wallet);`,

  'get-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "freeze"
      WHERE "status" != 'cancel';`,

  'get-user-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "freeze"
      WHERE
          "status" != 'cancel' AND
          "user_id" = GET_USER_ID($wallet);`,

  'get-users-sums': `
      SELECT
          "wallet",
          COALESCE(SUM("amount"), 0) AS "sum"
      FROM "freeze"
      NATURAL JOIN "users"
      WHERE "status" != 'cancel'
      GROUP BY "wallet"`,

  'get-by-wallet': `
      SELECT
          "hash",
          ABS("amount") AS "amount",
          "time",
          "status"
      FROM "freeze"
      WHERE "type" = $type AND "status" != 'cancel' AND
            "user_id" = GET_USER_ID($wallet)
      ORDER BY "time" DESC;`,

  'get-by-type-limit': `
      SELECT
          "hash",
          "wallet",
          "amount",
          "time",
          "status"
      FROM "freeze"
      NATURAL JOIN "users"
      WHERE "type" = $type AND "status" != 'cancel'
      ORDER BY "tx_id" DESC
      LIMIT $limit;`,
};
