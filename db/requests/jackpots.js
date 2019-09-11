module.exports = {
  'add': `
      INSERT INTO "jackpots" ("user_id", "type", "place", "prize", "status")
      VALUES (
          GET_USER_ID($wallet),
          $type,
          $place,
          $prize,
          $status
      ) RETURNING "payment_id" as "id"`,
};
