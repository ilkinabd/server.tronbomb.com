CREATE OR REPLACE FUNCTION random_string(length INTEGER) RETURNS TEXT AS
$$
DECLARE
  chars TEXT[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  IF length < 0 THEN
    raise exception 'Given length cannot be less than 0';
  END IF;
  FOR i IN 1..length LOOP
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "tokens" (
  "token_id" INTEGER     NOT NULL,
  "address"  CHAR(34),
  "SYMBOL"   VARCHAR(10) NOT NULL,
  "NAME"     VARCHAR(25) NOT NULL,
  "DECIMAL"  INTEGER NOT NULL,

  PRIMARY KEY("token_id"),
  UNIQUE("address")
);

INSERT INTO "tokens"
VALUES (0, NULL, 'TRX', 'TRON network token', 6);

CREATE TABLE "users" (
  "user_id"       SERIAL                      NOT NULL,
  "wallet"        CHAR(34)                    NOT NULL,
  "level"         INTEGER                     NOT NULL DEFAULT 1,
  "referrer"      INTEGER                     REFERENCES "users"("user_id"),
  "register_date" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "ref_id"        CHAR(6)                     NOT NULL DEFAULT random_string(6),
  "ref_profit"    FLOAT                       NOT NULL DEFAULT 0,

  PRIMARY KEY("user_id"),
  UNIQUE("wallet"),
  UNIQUE("ref_id")
);

CREATE TYPE GAME_STATUS AS ENUM (
  'start',
  'finish'
);

CREATE TYPE ROLL_TYPE AS ENUM (
  'under',
  'over',
  'exact'
);

CREATE TABLE "dice" (
  "game_id"      SERIAL      NOT NULL,
  "index"        INTEGER     NOT NULL,
  "finish_block" INTEGER     NOT NULL,
  "result"       INTEGER,
  "status"       GAME_STATUS NOT NULL DEFAULT 'start',
  "confirmed"    BOOLEAN     NOT NULL DEFAULT FALSE,

  PRIMARY KEY("game_id"),
  UNIQUE("index")
);

CREATE TABLE "dice_bets" (
  "bet_id"    SERIAL    NOT NULL,
  "game_id"   INTEGER   NOT NULL           REFERENCES "dice"("game_id"),
  "user_id"   INTEGER   NOT NULL           REFERENCES "users"("user_id"),
  "bet"       FLOAT     NOT NULL,
  "token_id"  INTEGER   NOT NULL DEFAULT 0 REFERENCES "tokens"("token_id"),
  "prize"     FLOAT,
  "number"    INTEGER   NOT NULL,
  "roll"      ROLL_TYPE NOT NULL,
  "confirmed" BOOLEAN   NOT NULL DEFAULT FALSE,
  "time"      TIME      WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("bet_id"),
  UNIQUE("game_id")
);

CREATE TABLE "wheel" (
  "game_id"      SERIAL      NOT NULL,
  "index"        INTEGER     NOT NULL,
  "finish_block" INTEGER     NOT NULL,
  "result"       INTEGER,
  "status"       GAME_STATUS NOT NULL DEFAULT 'start',
  "confirmed"    BOOLEAN     NOT NULL DEFAULT FALSE,

  PRIMARY KEY("game_id"),
  UNIQUE("index")
);

CREATE TABLE "wheel_bets" (
  "bet_id"    SERIAL    NOT NULL,
  "game_id"   INTEGER   NOT NULL           REFERENCES "wheel"("game_id"),
  "index"     INTEGER   NOT NULL,
  "user_id"   INTEGER   NOT NULL           REFERENCES "users"("user_id"),
  "bet"       FLOAT     NOT NULL,
  "token_id"  INTEGER   NOT NULL DEFAULT 0 REFERENCES "tokens"("token_id"),
  "prize"     FLOAT,
  "sector"    INTEGER   NOT NULL,
  "confirmed" BOOLEAN   NOT NULL DEFAULT FALSE,
  "time"      TIME      WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("bet_id"),
  UNIQUE("game_id", "index")
);

CREATE TYPE GAME_TYPE AS ENUM (
  'dice',
  'wheel'
);

CREATE TABLE "ref_payments" (
  "payment_id" SERIAL                      NOT NULL,
  "user_id"    INTEGER                     REFERENCES "users"("user_id"),
  "game_type"  GAME_TYPE                   NOT NULL,
  "game_id"    INTEGER                     NOT NULL,
  "referral"   INTEGER                     REFERENCES "users"("user_id"),
  "profit"     FLOAT                       NOT NULL,
  "date"       TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("payment_id")
);

CREATE TABLE "sockets" (
  "socket_id" CHAR(20)      NOT NULL,
  "rooms"     VARCHAR(25)[],

  PRIMARY KEY("socket_id")
);

CREATE TABLE "messages" (
  "message_id" SERIAL       NOT NULL,
  "user_id"    INTEGER      NOT NULL REFERENCES "users"("user_id"),
  "create_at"  TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "data"       JSON         NOT NULL,

  PRIMARY KEY("message_id")
);

CREATE TABLE "bans" (
  "ban_id"     SERIAL       NOT NULL,
  "user_id"    INTEGER      NOT NULL REFERENCES "users"("user_id"),
  "reason"     TEXT,
  "start_time" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "end_time"   TIMESTAMP(6),

  PRIMARY KEY("ban_id")
);
