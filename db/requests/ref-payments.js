module.exports = {
  'add': `
      INSERT INTO "ref_payments" (
          "user_id",
          "game_type",
          "game_id",
          "referral",
          "profit"
      ) VALUES (
          $referrer,
          $gameType,
          $index,
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $profit
      ) RETURNING "payment_id" as "id";`,
};
