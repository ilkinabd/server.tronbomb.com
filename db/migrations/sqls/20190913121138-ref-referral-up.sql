CREATE TYPE OPERATION_TYPE AS ENUM ('income', 'withdraw');

CREATE TABLE "referrals" (
  "operation_id" SERIAL         NOT NULL,
  "user_id"      INTEGER        NOT NULL REFERENCES "users"("user_id"),
  "type"         OPERATION_TYPE NOT NULL,
  "referral"     INTEGER        REFERENCES "users"("user_id"),
  "amount"       FLOAT          NOT NULL,
  "time"         TIMESTAMP      WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("operation_id")
);

--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION GET_REF_ID(CHAR(34))
RETURNS CHAR(6) AS
$$
  INSERT INTO "users" ("wallet")
  SELECT $1
  WHERE NOT EXISTS (SELECT * FROM "users" WHERE "wallet" = $1);
  SELECT "ref_id" FROM "users" WHERE "wallet" = $1;
$$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION GET_REFERRAL_PROFIT(INTEGER, INTEGER)
RETURNS FLOAT AS
$$
  SELECT COALESCE(SUM("amount"), 0)
  FROM "referrals"
  WHERE "type" = 'income' AND "user_id" = $1 AND "referral" = $2;
$$
LANGUAGE sql;
