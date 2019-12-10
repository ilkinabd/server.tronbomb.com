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
          "place"
      FROM "jackpots"
      NATURAL JOIN "users"
      WHERE "type" = 'random' AND "status" = FALSE;`,

  'delete-random-unconfirmed': `
      DELETE FROM "jackpots"
      WHERE "type" = 'random' AND "status" = FALSE;`,

  'get-by-type': `
      SELECT
          "wallet",
          "type",
          "place",
          "prize",
          "time"
      FROM "jackpots"
      NATURAL JOIN "users"
      WHERE "type" = $type AND "status" = TRUE
      ORDER BY "time" DESC;`,

  'get-not-shown': `
      SELECT "payment_id", "type", "prize", "time"
      FROM "jackpots"
      WHERE "user_id" = GET_USER_ID($wallet) 
      AND "popup_shown" = FALSE AND "status" = TRUE;
  `,

  'set-popup-shown': `
     UPDATE "jackpots"
     SET "popup_shown"= $value
     WHERE payment_id = $id;
   `,
};
