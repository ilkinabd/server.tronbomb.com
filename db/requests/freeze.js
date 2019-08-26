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
};
