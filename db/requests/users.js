module.exports = {
  'add': `
      INSERT INTO "users" ("wallet")
      VALUES ($wallet)
      RETURNING "user_id" as "id";`,

  'add-with-ref': `
      INSERT INTO "users" ("wallet", "referrer")
      SELECT
          $wallet,
          (SELECT "user_id" FROM "users" WHERE "ref_id" = $refId)
      RETURNING "user_id" as "id";`,

  'set-level': `
      UPDATE "users"
      SET "level" = $level
      WHERE "user_id" = $userId;`,

  'set-ref-id': `
      UPDATE "users"
      SET "ref_id" = $refId
      WHERE "wallet" = $wallet;`,

  'get': `
      SELECT "wallet", "level"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-id': `
      SELECT "user_id" as "id"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-ref-id': `
      SELECT "ref_id" as "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-wallet-by-ref-id': `
      SELECT "wallet" as "value"
      FROM "users"
      WHERE "ref_id" = $refId;`,

  'get-bet-sum': `
      SELECT SUM("bet") as "value"
      FROM (
          SELECT "bet", "user_id"
          FROM  "dice_bets"
          UNION ALL
          SELECT "bet", "user_id"
          FROM  "wheel_bets"
      ) AS "bets"
      WHERE "user_id" = $userId;`,

  'get-win-sum': `
      SELECT SUM("prize") as "value"
      FROM (
          SELECT "prize", "user_id"
          FROM  "dice_bets"
          UNION ALL
          SELECT "prize", "user_id"
          FROM  "wheel_bets"
      ) AS "bets"
      WHERE "user_id" = $userId;`,

  'get-top': `
      SELECT "wallet", "level", SUM("bet") as "betSum"
      FROM (
          SELECT "bet", "user_id"
          FROM  "dice_bets"
          UNION ALL
          SELECT "bet", "user_id"
          FROM  "wheel_bets"
      ) AS "bets"
      NATURAL JOIN "users"
      GROUP BY "wallet", "level"
      ORDER BY "level" DESC, "betSum" DESC
      LIMIT $limit;`,
};
