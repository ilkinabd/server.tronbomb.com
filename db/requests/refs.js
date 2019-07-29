module.exports = {
  'add': `
      INSERT INTO "referral" ("user_id")
      VALUES ($userId)
      RETURNING "ref_id" as "id";`,

  'get': `
      SELECT "ref_id" as "value"
      FROM "referral"
      WHERE "user_id" = $userId;`,
};
