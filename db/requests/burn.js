module.exports = {
  'add': `
      INSERT INTO "burn" (
          "hash",
          "amount",
          "from"
      ) VALUES (
          $hash,
          $amount,
          $from
      ) RETURNING "tx_id" as "id";`,

  'get-by-limit': `
      SELECT
          "hash",
          "amount",
          "from",
          "time"
      FROM "burn"
      ORDER BY "tx_id" DESC
      LIMIT $limit;`,
};
