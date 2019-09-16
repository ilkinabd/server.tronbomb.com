module.exports = {
  'add': `
      INSERT INTO "dividends" ("user_id", "amount", "type")
      VALUES (
          GET_USER_ID($wallet),
          $amount,
          $type
      ) RETURNING "dividend_id" AS "id"`,

  'get-user-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "dividends"
      WHERE "user_id" = GET_USER_ID($wallet);`,

  'get-by-wallet': `
      SELECT
          "wallet",
          "amount",
          "time"
      FROM "dividends"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet
      ORDER BY "time" DESC;`,

  'get-by-limit': `
      SELECT
          "wallet",
          "amount",
          "time"
      FROM "dividends"
      NATURAL JOIN "users"
      ORDER BY "time" DESC
      LIMIT $limit;`,
};
