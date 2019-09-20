module.exports = {
  'add': `
      INSERT INTO "bans" (
          "user_id",
          "reason",
          "end_time"
      ) VALUES (
          (SELECT "user_id" FROM "oauth_users" WHERE "index" = $index),
          $reason,
          $endTime
      ) RETURNING "ban_id" as "id";`,

  'get': `
      SELECT
          "reason",
          "end_time" as "endTime"
      FROM "bans"
      NATURAL JOIN "oauth_users"
      WHERE "index" = $index AND "end_time" > now();`,
};
