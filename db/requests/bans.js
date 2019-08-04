module.exports = {
  'add': `
      INSERT INTO "bans" (
          "user_id",
          "reason",
          "end_time"
      ) VALUES (
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $reason,
          $endTime
      ) RETURNING "ban_id" as "id";`,

  'get': `
      SELECT
          "reason",
          "start_time" as "startTime",
          "end_time" as "endTime",
          "end_time" > now() as "status"
      FROM "bans"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet AND "end_time" > now();`,
};
