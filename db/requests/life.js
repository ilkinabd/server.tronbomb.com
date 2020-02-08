module.exports = {
  add: `
      INSERT INTO "life" (
          "wallet",
          "amount",
          "level",
          "life"
      ) VALUES (
          $wallet,
          $amount,
          $level,
          $life
      ) RETURNING "id" AS "id";`,
};
