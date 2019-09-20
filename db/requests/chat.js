module.exports = {
  'add': `
      INSERT INTO "chat" (
          "user_id",
          "data"
      ) VALUES (
          (SELECT "user_id" FROM "oauth_users" WHERE "index" = $index),
          $data
      ) RETURNING "message_id" AS "id";`,

  'get-lasts': `
      WITH "msg" AS (
          SELECT * FROM "chat"
          ORDER BY "message_id" DESC LIMIT $limit
      ) SELECT
          "message_id" AS "id",
          "index",
          "name",
          "data",
          "time"
      FROM "msg"
      NATURAL JOIN "oauth_users"
      ORDER BY "time" ASC;`,
};
