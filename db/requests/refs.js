module.exports = {
  'add': `
      INSERT INTO "referral" ("user_id")
      VALUES ($userId)
      RETURNING "ref_id" as "id";`,

  'add-id': `
      INSERT INTO "referral" ("user_id", "ref_id")
      VALUES ($userId, $refId)
      RETURNING "ref_id" as "id";`,

  'is-exist': `
      SELECT EXISTS(
          SELECT "user_id" FROM "referral"
          WHERE "ref_id" = $refId
      ) as "value";`,

  'get': `
      SELECT "ref_id" as "value"
      FROM "referral"
      WHERE "user_id" = $userId;`,

  'get-wallet': `
      SELECT "wallet" as "value"
      FROM "referral"
      NATURAL JOIN "users"
      WHERE "ref_id" = $refId;`,

  'get-user-id': `
      SELECT "user_id" as "value"
      FROM "referral"
      WHERE "ref_id" = $refId;`,
};
