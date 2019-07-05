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

  'get-count': `
      SELECT COUNT("user_id") as "value"
      FROM "users";`,

  'get-top': `
      SELECT "wallet", "level"
      FROM "users"
      ORDER BY "level" DESC
      LIMIT $limit;`,
};
