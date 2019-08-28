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

  'get-max-bet': `
    SELECT COALESCE (
    (SELECT MAX("bet") FROM "auction" 
    WHERE "auction_number" = $id), 0) as "value";`,

  'get-all-bets': `
    SELECT "auction_id", "user_id", "bet"
    FROM "auction"
    WHERE "auction_number" = $auctionNumber
    ORDER BY "bet" DESC
    LIMIT $limit;`,

  'set-prize': `
    UPDATE "auction"
    SET "prize" = $prize
    WHERE "auction_id" = $id;`,
};
