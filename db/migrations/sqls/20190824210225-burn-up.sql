CREATE TABLE "burn" (
  "tx_id"  SERIAL                      NOT NULL,
  "hash"   CHAR(64)                    NOT NULL,
  "amount" FLOAT                       NOT NULL,
  "from"   CHAR(34)                    NOT NULL,
  "time"   TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("tx_id")
);
