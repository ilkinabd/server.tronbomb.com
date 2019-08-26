CREATE TYPE FREEZE_STATUS AS ENUM (
  'active',
  'complete'
);

CREATE TABLE "freeze" (
  "tx_id"   SERIAL        NOT NULL,
  "hash"    CHAR(64)      NOT NULL,
  "user_id" INTEGER       NOT NULL REFERENCES "users"("user_id"),
  "amount"  FLOAT         NOT NULL,
  "start"   TIMESTAMP     NOT NULL DEFAULT NOW(),
  "finish"  TIMESTAMP     NOT NULL,
  "status"  FREEZE_STATUS NOT NULL DEFAULT 'active',

  PRIMARY KEY("tx_id")
);
