CREATE TYPE JACKPOT_TYPE AS ENUM (
  'random',
  'bet_amount'
);

CREATE TABLE "jackpots" (
  "payment_id" SERIAL       NOT NULL,
  "user_id"    INTEGER      NOT NULL REFERENCES "users"("user_id"),
  "type"       JACKPOT_TYPE NOT NULL,
  "place"      INTEGER      NOT NULL,
  "prize"      FLOAT,
  "status"     BOOLEAN      NOT NULL,
  "time"       TIMESTAMP    WITHOUT TIME ZONE DEFAULT NOW(),

  PRIMARY KEY("payment_id")
);
