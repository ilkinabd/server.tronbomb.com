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

  'get-last-winner': `
      SELECT "wallet", "bet", "prize", "status", "time"
      FROM "auction"
      NATURAL JOIN "users"
      WHERE "status" = 'finish'
      ORDER BY "time" DESC
      LIMIT 1;`

};
