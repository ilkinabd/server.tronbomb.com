module.exports = {
  'add': `
      INSERT INTO "referrals" (
          "user_id",
          "type",
          "referral",
          "amount"
      ) VALUES (
          GET_USER_ID($wallet),
          COALESCE($type, 'income')::OPERATION_TYPE,
          GET_USER_ID($referral),
          $amount
      ) RETURNING "operation_id" AS "id";`,

  'get-type-by-wallet': `
      SELECT
          GET_WALLET("referral") AS "referral",
          ABS("amount"),
          "time"
      FROM "referrals"
      WHERE "user_id" = GET_USER_ID($wallet) AND type = $type
      ORDER BY "time" DESC;`,
};
