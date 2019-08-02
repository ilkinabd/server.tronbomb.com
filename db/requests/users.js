module.exports = {
  'add': `
      INSERT INTO "users" ("wallet")
      VALUES ($wallet)
      RETURNING "user_id" as "id";`,

  'add-ref': `
      INSERT INTO "users" ("wallet", "referrer")
      VALUES ($wallet, $referrer)
      RETURNING "user_id" as "id";`,

  'set-level': `
      UPDATE "users"
      SET "level" = $level
      WHERE "user_id" = $userId;`,

  'get': `
      SELECT "wallet", "level"
      FROM "users"
      WHERE "user_id" = $userId;`,

  'get-id': `
      SELECT "user_id" as "id"
      FROM "users"
      WHERE "wallet" = $wallet;`,

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
      ORDER BY "level" DESC
      LIMIT $limit;`,
};
