CREATE TABLE "dividends" (
  "dividend_id" SERIAL    NOT NULL,
  "user_id"     INTEGER   NOT NULL  REFERENCES "users"("user_id"),
  "amount"      FLOAT     NOT NULL,
  "time"        TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  PRIMARY KEY("dividend_id")
);
