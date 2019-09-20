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
          SELECT * FROM "chat" ORDER BY "message_id" DESC LIMIT $limit
      )
      SELECT "name", "data", "time"
      FROM "msg"
      NATURAL JOIN "oauth_users"
      ORDER BY "message_id" ASC;`,
};
