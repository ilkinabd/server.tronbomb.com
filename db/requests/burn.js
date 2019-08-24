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
};
