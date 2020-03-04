module.exports = {
  add: `
      INSERT INTO "dividends" ("user_id", "amount", "type")
      VALUES (
          GET_USER_ID($wallet),
          $amount,
          $type
      ) RETURNING "dividend_id" AS "id"`,

  'get-user-sum': `
      SELECT ROUND(COALESCE(SUM("amount")::DECIMAL, 0), 2) AS "value"
      FROM "dividends"
      WHERE "user_id" = GET_USER_ID($wallet);`,

  'get-last-by-wallet': `
      SELECT ABS("amount") AS "value"
      FROM "dividends" WHERE "user_id" = GET_USER_ID($wallet) 
      AND "type" = 'withdraw' ORDER BY "dividend_id" DESC LIMIT 1;`,

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
          ABS("amount") AS "amount",
          "time"
      FROM "dividends"
      NATURAL JOIN "users"
      WHERE "type" = $type
      ORDER BY "time" DESC
      LIMIT $limit;`,
};
