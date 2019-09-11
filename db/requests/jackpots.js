module.exports = {
  'add': `
      INSERT INTO "jackpots" ("user_id", "type", "place", "prize", "status")
      VALUES (
          GET_USER_ID($wallet),
          $type,
          $place,
          $prize,
          $status
      ) RETURNING "payment_id" as "id";`,

  'get-random-unconfirmed': `
      SELECT
          "wallet",
          "place",
          "prize",
          "time"
      FROM "jackpots"
      NATURAL JOIN "users"
      WHERE "type" = 'random' AND "status" = FALSE;`,

  'delete-random-unconfirmed': `
      DELETE FROM "jackpots"
      WHERE "type" = 'random' AND "status" = FALSE;`,
};
