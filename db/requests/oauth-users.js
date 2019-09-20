module.exports = {
  'add': `
      INSERT INTO "oauth_users" ("index", "name")
      VALUES ($index, $name)
      ON CONFLICT ("index") DO NOTHING
      RETURNING "user_id" AS "id";`,

  'get': `
      SELECT "index", "name"
      FROM "oauth_users"
      WHERE "index" = $index;`,
};
