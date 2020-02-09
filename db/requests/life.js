module.exports = {
  add: `
      INSERT INTO "life" (
          "wallet",
          "amount",
          "level",
          "life",
          "hash"
      ) VALUES (
          $wallet,
          $amount,
          $level,
          $life,
          $hash
      ) RETURNING "id" AS "id";`,

  'get-by-hash': `SELECT "id" AS "value" FROM "life" WHERE "hash" = $hash;`,
};
