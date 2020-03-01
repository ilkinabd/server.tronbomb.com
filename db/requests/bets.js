module.exports = {
  add: `
      INSERT INTO "bets" (
          "user_id",
          "bet",
          "prize"
      ) VALUES (
          $userId,
          $bet,
          $prize
      ) RETURNING "id" AS "id";`,

  'get-profit': `
      SELECT COALESCE(SUM("bet") - SUM("prize"), 0) AS "value"
      FROM "bets"
      WHERE "time" > NOW() - ($interval / 1000) * INTERVAL '1 seconds';`,
};
