module.exports = {
  'get-by-wallet': `
      SELECT
          "status",
          "hash",
          "amount",
          "to",
          "fee",
          "time"
      FROM "ref_withdraws"
      WHERE "user_id" = (
          SELECT "user_id" FROM "users" WHERE "wallet" = $wallet
      );`,
};
