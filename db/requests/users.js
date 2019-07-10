module.exports = {
  'add': `
      INSERT INTO "users" ("wallet")
      VALUES ($wallet)
      RETURNING "user_id" as "id";`,

  'set-level': `
      UPDATE "users"
      SET "level" = $level
      WHERE "user_id" = $userId;`,

  'get': `
      SELECT "wallet", "level"
      FROM "users"
      WHERE "user_id" = $userId;`,

  'get-id': `
      SELECT "user_id" as "id"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-count': `
      SELECT COUNT("user_id") as "value"
      FROM "users";`,

  'get-top': `
      SELECT "wallet", "level", SUM("bet") as "betSum"
      FROM "users"
      NATURAL JOIN "bets"
      GROUP BY "wallet", "level"
      ORDER BY "level" DESC
      LIMIT $limit;`,
};
