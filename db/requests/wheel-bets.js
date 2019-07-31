module.exports = {
  'add': `
        INSERT INTO "wheel_bets" (
            "game_id",
            "index",
            "user_id",
            "bet",
            "sector"
        ) VALUES (
            $gameId,
            $index,
            $userId,
            $bet,
            $sector
        ) RETURNING "bet_id" as "id";`,

  'get-sum': `
        SELECT SUM("bet") as "value"
        FROM "wheel_bets"
        WHERE "user_id" = $userId;`,
};
