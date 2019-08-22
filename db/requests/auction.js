module.exports = {
  'add': `
      INSERT INTO "auction" (
          "user_id",
          "status",
          "bet"
      ) VALUES (
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $status,
          $bet
      ) RETURNING "auction_id" as "id";`,

  'get-max-bet-for-auction': `
    SELECT MAX("bet") FROM "auction" WHERE "auction_id" = $id;`
};
