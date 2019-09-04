module.exports = {
  'add': `
      INSERT INTO "mining" ("user_id", "type", "amount")
      VALUES (
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $type,
          $amount
      ) RETURNING "mining_id" as "id"`,

  'get-user-sum': `
      SELECT COALESCE(SUM("amount"), 0) AS "value"
      FROM "mining"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet;`,
};
