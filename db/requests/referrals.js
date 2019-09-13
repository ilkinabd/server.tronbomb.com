module.exports = {
  'add': `
      INSERT INTO "referrals" (
          "user_id",
          "type",
          "referral",
          "amount"
      ) VALUES (
          GET_USER_ID($referrer),
          $type,
          GET_USER_ID($wallet),
          $amount
      ) RETURNING "operation_id" as "id";`,
};
