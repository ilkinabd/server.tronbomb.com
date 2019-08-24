module.exports = {
  'add': `
      INSERT INTO "ref_withdraws" (
          "user_id",
          "amount",
          "to",
          "fee",
          "code"
      ) VALUES (
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $amount,
          $to,
          $fee,
          (SELECT FLOOR(RANDOM() * 1000000000 + 1)::INTEGER)
      ) RETURNING "code" as "value";`,

  'set-complete': `
      UPDATE "ref_withdraws"
      SET ("status", "hash") = (TRUE, $hash)
      WHERE "tx_id" = $txId;`,

  'get-by-wallet': `
      SELECT
          "status",
          "hash",
          "amount",
          "to",
          "fee",
          "time"
      FROM "ref_withdraws"
      WHERE "user_id" = (
          SELECT "user_id" FROM "users" WHERE "wallet" = $wallet
      );`,

  'get-by-code': `
      SELECT "tx_id" as "txId", "amount", "to", "fee"
      FROM "ref_withdraws"
      WHERE
          "user_id" = (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet)
          AND "code" = $code AND "status" = FALSE;`,
};
