module.exports = {
  'add': `
      INSERT INTO "bans" ("user_id", "reason", "end_time")
      VALUES ($userId, $reason, $endTime)
      RETURNING "ban_id" as "id";`,

  'set-status': `
      UPDATE "bans"
      SET "status" = $status
      WHERE "ban_id" = $banId;`,

  'get': `
      SELECT "reason", "end_time" as "endTime"
      FROM "bans"
      WHERE "user_id" = $userId AND "status" = TRUE;`,

  'get-status': `
      SELECT EXISTS(
          SELECT "ban_id" FROM "bans"
          WHERE "user_id" = $userId AND "status" = TRUE
      ) as "value";`,

  'get-active': `
      SELECT "ban_id" as "banId", "end_time" as "endTime"
      FROM "bans"
      WHERE "status" = TRUE;`,
};
