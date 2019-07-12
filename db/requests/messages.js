module.exports = {
  'add': `
      INSERT INTO "messages" ("user_id", "data")
      VALUES ($userId, $data)
      RETURNING NOW() as "value";`,

  'get-by-limit': `
      WITH "msg" AS (
          SELECT * FROM "messages" ORDER BY "message_id" DESC LIMIT $limit
      )
      SELECT "wallet", "create_at" as "createAt", "data"
      FROM "msg"
      NATURAL JOIN "users"
      ORDER BY "message_id" ASC;`,
};
