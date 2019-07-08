module.exports = {
  'add': `
      INSERT INTO "messages" ("user_id", "data")
      VALUES ($userId, $data)
      RETURNING "message_id" as "id";`,

  'get-by-limit': `
      SELECT "wallet", "create_at" as "createAt", "data"
      FROM "messages"
      NATURAL JOIN "users"
      LIMIT $limit;`,
};
