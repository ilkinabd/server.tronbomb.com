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
};
