DROP TABLE "referrals";
DROP TYPE OPERATION_TYPE;

--------------------------------------------------------------------------------

DROP FUNCTION GET_REF_ID;

--------------------------------------------------------------------------------

CREATE TYPE GAME_TYPE AS ENUM (
  'dice',
  'wheel'
);

CREATE TABLE "ref_payments" (
  "payment_id" SERIAL                      NOT NULL,
  "user_id"    INTEGER                     NOT NULL REFERENCES "users"("user_id"),
  "game_type"  GAME_TYPE                   NOT NULL,
  "game_id"    INTEGER                     NOT NULL,
  "referral"   INTEGER                     NOT NULL REFERENCES "users"("user_id"),
  "profit"     FLOAT                       NOT NULL,
  "time"       TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("payment_id")
);

CREATE TABLE "ref_withdraws" (
  "tx_id"   SERIAL                      NOT NULL,
  "user_id" INTEGER                     NOT NULL REFERENCES "users"("user_id"),
  "status"  BOOLEAN                     NOT NULL DEFAULT FALSE,
  "hash"    CHAR(64),
  "amount"  FLOAT                       NOT NULL,
  "to"      CHAR(34)                    NOT NULL,
  "fee"     FLOAT,
  "time"    TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("tx_id")
);
