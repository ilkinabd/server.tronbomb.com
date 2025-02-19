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

  'get-by-wallet': `SELECT * FROM "life" WHERE "wallet" = $wallet;`,

  'get-all': `SELECT * FROM "life";`,

  'get-balance': `SELECT sum("life") as "value" from "life" WHERE 
                  "wallet" = $wallet AND "withdrawn" = false;`,
};
