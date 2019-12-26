module.exports = {
  add: `
      SELECT ADD_WALLET($wallet) AS "id";`,

  'set-level': `
      UPDATE "users"
      SET "level" = $level
      WHERE "wallet" = $wallet;`,

  'set-ref-id': `
      UPDATE "users"
      SET "ref_id" = $refId
      WHERE "user_id" = ADD_WALLET($wallet) AND NOT EXISTS (
          SELECT "user_id" FROM "users" WHERE "ref_id" = $refId
      ) RETURNING TRUE as "value";`,

  'set-referrer': `
      UPDATE "users"
      SET "referrer" = GET_USER_ID($referrer)
      WHERE "user_id" = $userId;`,

  'set-ref-profit': `
      UPDATE "users"
      SET "ref_profit" = "ref_profit" + $delta
      WHERE "wallet" = $wallet;`,

  'set-mine': `
      UPDATE "users"
      SET "mine" = "mine" + $delta
      WHERE "wallet" = $wallet;`,

  'is-exist': `
      SELECT EXISTS (
          SELECT * FROM "users" WHERE "wallet" = $wallet
      ) AS "value";`,

  'get-id': `
      SELECT "user_id" as "id"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-level': `
      SELECT "level" as "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-referrers': `
      WITH RECURSIVE "rec" AS (
          SELECT "referrer", "wallet", 0 AS "level"
          FROM "users" WHERE "wallet" = $wallet
          UNION ALL
          SELECT
              "users"."referrer",
              "users"."wallet",
              "rec"."level" + 1 AS "level"
          FROM "users"
          JOIN "rec" ON "rec"."referrer" = "users"."user_id"
          WHERE "rec"."level" < 2
      )
      SELECT ARRAY_AGG("wallet") AS "value" FROM "rec"
      WHERE "level" > 0;`,

  'get-referrals': `
      WITH RECURSIVE "rec" AS (
          SELECT "user_id", "wallet", "register_date", 0 AS "level"
          FROM "users" WHERE "user_id" = GET_USER_ID($wallet)
          UNION ALL
          SELECT
              "users"."user_id",
              "users"."wallet",
              "users"."register_date",
              "rec"."level" + 1 AS "level"
          FROM "users"
          JOIN "rec" ON "users"."referrer" = "rec"."user_id"
          WHERE "rec"."level" < 2
      )
      SELECT
          "wallet" AS "referral",
          COALESCE(
              GET_REFERRAL_PROFIT(GET_USER_ID($wallet), GET_USER_ID("wallet")),
          0) AS "profit",
          "register_date" AS "registerDate",
          "level"
      FROM "rec"
      WHERE "level" > 0;`,

  'get-referrals-count': `
      SELECT COUNT("wallet")::INTEGER AS "value"
      FROM "users"
      WHERE "referrer" = GET_USER_ID($wallet);`,

  'get-ref-id': `
      SELECT GET_REF_ID($wallet) AS "value";`,

  'get-ref-profit': `
      SELECT "ref_profit" AS "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-mine': `
      SELECT "mine" AS "value"
      FROM "users"
      WHERE "wallet" = $wallet;`,

  'get-wallet-by-ref-id': `
      SELECT "wallet" AS "value"
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

  'get-all-bets': `SELECT * FROM get_all_bets($limit) order by "time" desc limit $limit;`,

  'get-all-bets-by-wallet': `SELECT * FROM get_all_bets_by_wallet($limit,$wallet) order by "time" desc limit $limit;`,

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

  'get-top-24': `
      SELECT "wallet", "level", SUM("bet") as "betSum"
      FROM (SELECT * FROM get_bets_for_interval()) AS "bets"
      NATURAL JOIN "users"
      GROUP BY "wallet", "level"
      ORDER BY "betSum" DESC
      LIMIT $limit;`,
};
