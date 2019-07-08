module.exports = {
  'add': `
      INSERT INTO "bans" ("user_id", "reason", "end_time")
      VALUES (1, 'suka zaebal', '2019-07-08 20:10:34.474987')
      RETURNING "ban_id" as "id";`,

  'set-status': `
      UPDATE "bans"
      SET "status" = FALSE
      WHERE "ban_id" = 1;`,

  'get-active': `
      SELECT * FROM "bans"
      WHERE "status" = TRUE;`,
};
