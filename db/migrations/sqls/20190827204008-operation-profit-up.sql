CREATE TABLE "operation_profit" (
  "profit_id" SERIAL  NOT NULL,
  "amount"    FLOAT   NOT NULL,
  "date"      DATE    NOT NULL DEFAULT NOW(),
  "status"    BOOLEAN NOT NULL DEFAULT FALSE,

  PRIMARY KEY("profit_id")
);
