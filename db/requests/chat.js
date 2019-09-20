module.exports = {
  'add': `
      INSERT INTO "chat" (
          "user_id",
          "data"
      ) VALUES (
          (SELECT "user_id" FROM "oauth_users" WHERE "index" = $index),
          $data
      ) RETURNING "time" AS "value";`,

  'get-by-limit': `
      WITH "msg" AS (
          SELECT * FROM "messages" ORDER BY "message_id" DESC LIMIT $limit
      )
      SELECT "wallet", "create_at" as "createAt", "data"
      FROM "msg"
      NATURAL JOIN "users"
      ORDER BY "message_id" ASC;`,
};
