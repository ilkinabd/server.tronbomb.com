CREATE TABLE "auction" (
  "auction_id" SERIAL      NOT NULL,
  "user_id"    INTEGER     NOT NULL  REFERENCES "users"("user_id"),
  "status"     VARCHAR(25),
  "bet"        INTEGER     NOT NULL,
  "time"       TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("auction_id")
)
