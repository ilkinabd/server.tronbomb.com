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

  'get-bet-count': `
      SELECT COUNT("bet")::FLOAT AS "value"
      FROM "bets";`,

  'get-prize-sum': `
      SELECT COALESCE(SUM("prize"), 0) AS "value"
      FROM "bets";`,

  'get-profit': `
      SELECT COALESCE(SUM("bet") - SUM("prize"), 0) AS "value"
      FROM "bets"
      WHERE "time" > NOW() - ($interval / 1000) * INTERVAL '1 seconds';`,
};
