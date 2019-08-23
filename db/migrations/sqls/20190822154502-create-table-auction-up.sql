CREATE TYPE AUCTION_STATUS AS ENUM(
    'start',
    'finish'
);

CREATE TABLE "auction" (
  "auction_id" SERIAL         NOT NULL,
  "user_id"    INTEGER        NOT NULL  REFERENCES "users"("user_id"),
  "status"     AUCTION_STATUS NOT NULL DEFAULT 'start',
  "bet"        FLOAT          NOT NULL,
  "prize"      FLOAT,
  "time"       TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("auction_id")
);
