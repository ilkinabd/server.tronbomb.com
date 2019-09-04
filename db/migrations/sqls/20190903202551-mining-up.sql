CREATE TYPE MINING_TYPE AS ENUM (
  'mine',
  'withdraw'
);

CREATE TABLE "mining" (
  "mining_id" SERIAL      NOT NULL,
  "user_id"   INTEGER     NOT NULL REFERENCES "users"("user_id"),
  "type"      MINING_TYPE NOT NULL,
  "amount"    FLOAT       NOT NULL,
  "time"      TIMESTAMP   WITHOUT TIME ZONE DEFAULT NOW(),

  PRIMARY KEY("mining_id")
);
