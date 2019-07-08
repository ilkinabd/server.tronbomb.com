module.exports = {
  'add': `
      INSERT INTO "bans" ("user_id", "reason", "end_time")
      VALUES ($userId, $reason, $endTime)
      RETURNING "ban_id" as "id";`,

  'set-status': `
      UPDATE "bans"
      SET "status" = Sstatus
      WHERE "ban_id" = $banId;`,

  'get-active': `
      SELECT * FROM "bans"
      WHERE "status" = TRUE;`,
};
