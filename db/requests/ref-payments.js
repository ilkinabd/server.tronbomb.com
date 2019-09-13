module.exports = {
  'get-by-wallet': `
      SELECT
          "wallet",
          "time",
          "profit"
      FROM "ref_payments"
      LEFT JOIN "users" ON "users"."user_id" = "ref_payments"."referral"
      WHERE "ref_payments"."user_id" = (
          SELECT "user_id" FROM "users" WHERE "wallet" = $wallet
      );`,

  'get-group-by-wallet': `
      SELECT
          "wallet",
          "register_date",
          SUM("profit") as "profit"
      FROM "ref_payments"
      LEFT JOIN "users" ON "users"."user_id" = "ref_payments"."referral"
      WHERE "ref_payments"."user_id" = (
          SELECT "user_id" FROM "users" WHERE "wallet" = $wallet
      ) GROUP BY "wallet", "register_date";`,
};
