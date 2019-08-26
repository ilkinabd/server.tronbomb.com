module.exports = {
  'add': `
      INSERT INTO "freeze" (
          "hash",
          "user_id",
          "amount",
          "finish"
      ) VALUES (
          $hash,
          $userId,
          $amount,
          $finishTime
      ) RETURNING "tx_id" as "id";`,
};
