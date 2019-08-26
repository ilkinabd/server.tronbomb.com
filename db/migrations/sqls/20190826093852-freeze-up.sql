CREATE TABLE "freeze" (
  "tx_id"   SERIAL                      NOT NULL,
  "hash"    CHAR(64)                    NOT NULL,
  "user_id" INTEGER                     NOT NULL REFERENCES "users"("user_id"),
  "amount"  FLOAT                       NOT NULL,
  "start"   TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "finish"  TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("tx_id")
);
