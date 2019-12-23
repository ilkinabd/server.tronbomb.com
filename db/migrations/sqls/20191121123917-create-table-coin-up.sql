CREATE TABLE "coin" (
  "game_id"      SERIAL      NOT NULL,
  "index"        INTEGER     NOT NULL,
  "finish_block" INTEGER     NOT NULL,
  "user_id"      INTEGER     NOT NULL  REFERENCES "users"("user_id"),
  "bet"          FLOAT       NOT NULL,
  "number"       INTEGER     NOT NULL,
  "result"       INTEGER,
  "prize"        FLOAT,
  "status"       GAME_STATUS NOT NULL DEFAULT 'start',
  "confirmed"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "time"         TIMESTAMP            WITHOUT TIME ZONE DEFAULT now(),
  "symbol"       SYMBOL NOT NULL DEFAULT 'TRX',

  PRIMARY KEY("game_id"),
  UNIQUE("index")
);