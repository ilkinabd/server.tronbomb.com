module.exports = {
  'add': `
      INSERT INTO "dividends" ("user_id", "amount")
      VALUES (
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $amount
      ) RETURNING "dividend_id" as "id"`,

  'get-user-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "dividends"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet;`,
};
