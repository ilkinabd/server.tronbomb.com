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
