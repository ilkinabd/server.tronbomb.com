module.exports = {
  'add': `
      INSERT INTO "dividends" ("user_id", "amount", "type")
      VALUES (
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $amount,
          $type
      ) RETURNING "dividend_id" as "id"`,

  'get-user-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "dividends"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet;`,

  'get-by-limit': `
      SELECT
          "wallet",
          "amount",
          "time"
      FROM "dividends"
      NATURAL JOIN "users"
      ORDER BY "dividend_id" DESC
      LIMIT $limit;`,
};
