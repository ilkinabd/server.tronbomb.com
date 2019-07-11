module.exports = {
  'add': `
      INSERT INTO "messages" ("user_id", "data")
      VALUES ($userId, $data)
      RETURNING NOW() as "value";`,

  'get-by-limit': `
      SELECT "wallet", "create_at" as "createAt", "data"
      FROM "messages"
      NATURAL JOIN "users"
      ORDER BY "message_id" DESC
      LIMIT $limit;`,
};
