module.exports = {
  'add': `
      INSERT INTO "auction" (
          "user_id",
          "index",
          "bet"
      ) VALUES (
          GET_USER_ID($wallet),
          $index,
          $bet
      ) RETURNING "time" AS "value";`,

  'get-max-bet': `
      SELECT COALESCE(MAX("bet"), 0) AS "value"
      FROM "auction"
      WHERE "index" = $index;`,

  'get-by-limit': `
      SELECT
          "wallet",
          "index",
          "bet",
          "time"
      FROM "auction"
      NATURAL JOIN "users"
      WHERE "index" = $index
      ORDER BY "bet" DESC
      LIMIT $limit;`,

  'get-all': `
      SELECT "auction_id" AS "auctionId", "wallet", "bet"
      FROM "auction"
      NATURAL JOIN "users"
      WHERE "auction_number" = $auctionNumber
      ORDER BY "bet" DESC;`,

  'set-prize': `
      UPDATE "auction"
      SET ("prize", "status") = ($prize, 'finish')
      WHERE "auction_id" = $auctionId;`,

  'get-last-winner': `
      SELECT "wallet", "bet", "prize", "status", "time"
      FROM "auction"
      NATURAL JOIN "users"
      WHERE "status" = 'finish'
      ORDER BY "time" DESC
      LIMIT 1;`
};
