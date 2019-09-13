module.exports = {
  'add': `
      SELECT GET_USER_ID($wallet) AS "id";`,

  'set-level': `
      UPDATE "users"
      SET "level" = $level
      WHERE "wallet" = $wallet;`,

  'set-ref-id': `
      UPDATE "users"
      SET "ref_id" = $refId
      WHERE "user_id" = $userId AND NOT EXISTS (
          SELECT "user_id" FROM "users" WHERE "ref_id" = $refId
      ) RETURNING TRUE as "value";`,

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

  'get-referrals': `
      SELECT
          "wallet",
          "register_date",
          GET_REFERRAL_PROFIT("referrer", "user_id") AS "profit"	
      FROM "users"
      WHERE "referrer" = GET_USER_ID($wallet);`,

  'get-referrals-count': `
      SELECT COUNT("wallet")::INTEGER AS "value"
      FROM "users"
      WHERE "referrer" = GET_USER_ID($wallet);`,

  'get-ref-id': `
      SELECT GET_REF_ID($wallet) AS "value";`,

  'get-ref-profit': `
      SELECT "ref_profit" as "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-wallet-by-ref-id': `
      SELECT "wallet" as "value"
      FROM "users"
      WHERE "ref_id" = $refId;`,

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
