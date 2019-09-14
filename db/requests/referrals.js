module.exports = {
  'add-income': `
      INSERT INTO "referrals" (
          "user_id",
          "type",
          "referral",
          "amount"
      ) VALUES (
          GET_USER_ID($wallet),
          'income',
          GET_USER_ID($referral),
          $amount
      ) RETURNING "operation_id" AS "id";`,

  'add-withdraw': `
      INSERT INTO "referrals" (
          "user_id",
          "type",
          "amount"
      ) VALUES (
          GET_USER_ID($wallet),
          'withdraw',
          $amount
      ) RETURNING "operation_id" AS "id";`,

  'get-income-by-wallet': `
      SELECT
          (
              SELECT "wallet" FROM "users" WHERE "user_id" = "referral"
          ) AS "referral",
          "amount",
          "time"
      FROM "referrals"
      WHERE "user_id" = GET_USER_ID($wallet) AND type = 'income'
      ORDER BY "time" DESC;`,

  'get-withdraw-by-wallet': `
      SELECT -"amount" AS "amount", "time"
      FROM "referrals"
      WHERE "user_id" = GET_USER_ID($wallet) AND type = 'withdraw'
      ORDER BY "time" DESC;`,
};
