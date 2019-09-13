module.exports = {
  'add-income': `
      INSERT INTO "referrals" (
          "user_id",
          "type",
          "referral",
          "amount"
      ) VALUES (
          GET_USER_ID($wallet),
          'income',
          GET_USER_ID($referral),
          $amount
      ) RETURNING "operation_id" AS "id";`,

  'add-withdraw': `
      INSERT INTO "referrals" (
          "user_id",
          "type",
          "amount"
      ) VALUES (
          GET_USER_ID($wallet),
          'withdraw',
          $amount
      ) RETURNING "operation_id" AS "id";`,
};
