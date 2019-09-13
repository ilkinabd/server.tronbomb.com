module.exports = {
  'add': `
      INSERT INTO "users" ("wallet", "referrer")
      SELECT
          $wallet,
          (SELECT "user_id" FROM "users" WHERE "wallet" = $referrer)
      RETURNING "user_id" as "id";`,

  'set-level': `
      UPDATE "users"
      SET "level" = $level
      WHERE "wallet" = $wallet;`,

  'set-ref-id': `
      UPDATE "users"
      SET "ref_id" = $refId
      WHERE
          "wallet" = $wallet AND
          NOT EXISTS (SELECT "user_id" FROM "users" WHERE "ref_id" = $refId)
      RETURNING TRUE as "value";`,

  'set-ref-profit': `
      UPDATE "users"
      SET "ref_profit" = "ref_profit" + $delta
      WHERE "wallet" = $wallet;`,

  'get-id': `
      SELECT "user_id" as "id"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-level': `
      SELECT "level" as "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-referrer': `
      SELECT "wallet" AS "value"
      FROM "users"
      WHERE "user_id" = (
          SELECT "referrer" FROM "users" WHERE "wallet" = $wallet
      );`,

  'get-ref-id': `
      SELECT "ref_id" as "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-ref-profit': `
      SELECT "ref_profit" as "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-wallet-by-ref-id': `
      SELECT "wallet" as "value"
      FROM "users"
      WHERE "ref_id" = $refId;`,

  'get-referrals': `
      SELECT ARRAY_AGG("wallet") as "value"
      FROM "users"
      WHERE "referrer" = (
          SELECT "user_id" FROM "users" WHERE "wallet" = $wallet
      );`,

  'get-referrals-count': `
      SELECT COUNT("wallet")::INTEGER as "value"
      FROM "users"
      WHERE "referrer" = (
          SELECT "user_id" FROM "users" WHERE "wallet" = $wallet
      );`,

  'get-bet-sum': `
      SELECT SUM("bet") as "value"
      FROM (
          SELECT "bet", "user_id" FROM "dice"
          UNION ALL
          SELECT "bet", "user_id" FROM "wheel"
      ) AS "bets"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet;`,

  'get-trx-bet-sum': `
      SELECT SUM("bet") as "value"
      FROM (
          SELECT "bet", "user_id", "symbol" FROM "dice"
          UNION ALL
          SELECT "bet", "user_id", "symbol" FROM "wheel"
      ) AS "bets"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet AND "symbol" = 'TRX';`,

  'get-win-sum': `
      SELECT SUM("prize") as "value"
      FROM (
          SELECT "prize", "user_id" FROM "dice"
          UNION ALL
          SELECT "prize", "user_id" FROM "wheel"
      ) AS "bets"
      NATURAL JOIN "users"
      WHERE "wallet" = $wallet;`,

  'get-top': `
      SELECT "wallet", "level", SUM("bet") as "betSum"
      FROM (
          SELECT "bet", "user_id" FROM "dice"
          UNION ALL
          SELECT "bet", "user_id" FROM "wheel"
      ) AS "bets"
      NATURAL JOIN "users"
      GROUP BY "wallet", "level"
      ORDER BY "level" DESC, "betSum" DESC
      LIMIT $limit;`,
};
