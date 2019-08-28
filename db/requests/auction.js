module.exports = {
  'add': `
      INSERT INTO "auction" (
          "user_id",
          "auction_number",
          "bet"
      ) VALUES (
          (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
          $auctionNumber,
          $bet
      ) RETURNING "time" as "value";`,

  'get-max-bet': `
      SELECT COALESCE(MAX("bet"), 0) AS "value"
      FROM "auction"
      WHERE "auction_number" = $auctionNumber;`,

  'get-by-limit': `
      SELECT "wallet", "bet"
      FROM "auction"
      NATURAL JOIN "users"
      WHERE "auction_number" = $auctionNumber
      ORDER BY "bet" DESC
      LIMIT $limit;`,

  'set-prize': `
    UPDATE "auction"
    SET "prize" = $prize
    WHERE "auction_id" = $id;`,
};
