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

CREATE OR REPLACE FUNCTION ADD_WALLET(CHAR(34))
RETURNS INTEGER AS
$$
  INSERT INTO "users" ("wallet")
  SELECT $1
  WHERE NOT EXISTS (SELECT * FROM "users" WHERE "wallet" = $1);
  SELECT "user_id" FROM "users" WHERE "wallet" = $1;
$$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION GET_USER_ID(CHAR(34))
RETURNS INTEGER AS
$$
  SELECT "user_id" FROM "users"
  WHERE "wallet" = $1;
$$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION GET_WALLET(INTEGER)
RETURNS CHAR(34) AS
$$
  SELECT "wallet" FROM "users"
  WHERE "user_id" = $1;
$$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION GET_REF_ID(CHAR(34))
RETURNS CHAR(6) AS
$$
  SELECT "ref_id" FROM "users"
  WHERE "wallet" = $1;
$$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION GET_REFERRAL_PROFIT(INTEGER, INTEGER)
RETURNS FLOAT AS
$$
  SELECT COALESCE(SUM("amount"), 0)
  FROM "referrals"
  WHERE "type" = 'income' AND "user_id" = $1 AND "referral" = $2;
$$
LANGUAGE sql;

--------------------------------------------------------------------------------

CREATE TABLE "users" (
  "user_id"       SERIAL    NOT NULL,
  "wallet"        CHAR(34)  NOT NULL,
  "level"         INTEGER   NOT NULL DEFAULT 1,
  "referrer"      INTEGER   REFERENCES "users"("user_id"),
  "register_date" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "ref_id"        CHAR(6)   NOT NULL DEFAULT random_string(6),
  "ref_profit"    FLOAT     NOT NULL DEFAULT 0,
  "mine"          FLOAT     NOT NULL DEFAULT 0,

  PRIMARY KEY("user_id"),
  UNIQUE("wallet"),
  UNIQUE("ref_id")
);

CREATE TYPE GAME_STATUS AS ENUM ('start', 'finish');
CREATE TYPE SYMBOL AS ENUM ('TRX', 'BOMB');

CREATE TYPE ROLL_TYPE AS ENUM ('under', 'over', 'exact');

CREATE TABLE "dice" (
  "game_id"      SERIAL      NOT NULL,
  "index"        INTEGER     NOT NULL,
  "finish_block" INTEGER     NOT NULL,
  "user_id"      INTEGER     NOT NULL REFERENCES "users"("user_id"),
  "bet"          FLOAT       NOT NULL,
  "symbol"       SYMBOL      NOT NULL DEFAULT 'TRX',
  "number"       INTEGER     NOT NULL,
  "roll"         ROLL_TYPE   NOT NULL,
  "result"       INTEGER,
  "prize"        FLOAT,
  "status"       GAME_STATUS NOT NULL DEFAULT 'start',
  "confirmed"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "time"         TIMESTAMP            WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("game_id"),
  UNIQUE("index")
);

CREATE TABLE "wheel" (
  "game_id"      SERIAL      NOT NULL,
  "index"        INTEGER     NOT NULL,
  "finish_block" INTEGER     NOT NULL,
  "user_id"      INTEGER     NOT NULL  REFERENCES "users"("user_id"),
  "bet"          FLOAT       NOT NULL,
  "symbol"       SYMBOL      NOT NULL DEFAULT 'TRX',
  "sector"       INTEGER     NOT NULL,
  "result"       INTEGER,
  "prize"        FLOAT,
  "status"       GAME_STATUS NOT NULL DEFAULT 'start',
  "confirmed"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "time"         TIMESTAMP            WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("game_id"),
  UNIQUE("index")
);

CREATE TYPE OPERATION_TYPE AS ENUM ('income', 'withdraw');

CREATE TABLE "referrals" (
  "operation_id" SERIAL         NOT NULL,
  "user_id"      INTEGER        NOT NULL REFERENCES "users"("user_id"),
  "type"         OPERATION_TYPE NOT NULL,
  "referral"     INTEGER        REFERENCES "users"("user_id"),
  "amount"       FLOAT          NOT NULL,
  "time"         TIMESTAMP      WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("operation_id")
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

CREATE TABLE "burn" (
  "tx_id"  SERIAL                      NOT NULL,
  "hash"   CHAR(64)                    NOT NULL,
  "amount" FLOAT                       NOT NULL,
  "from"   CHAR(34)                    NOT NULL,
  "time"   TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  PRIMARY KEY("tx_id")
);

CREATE TYPE FREEZE_STATUS AS ENUM (
  'cancel',
  'awaiting',
  'complete'
);

CREATE TYPE FREEZE_TYPE AS ENUM (
  'freeze',
  'unfreeze'
);

CREATE TABLE "freeze" (
  "tx_id"   SERIAL        NOT NULL,
  "hash"    CHAR(64),
  "user_id" INTEGER       NOT NULL REFERENCES "users"("user_id"),
  "amount"  FLOAT         NOT NULL,
  "time"    TIMESTAMP     WITHOUT TIME ZONE DEFAULT NOW(),
  "status"  FREEZE_STATUS NOT NULL DEFAULT 'awaiting',
  "type"    FREEZE_TYPE   NOT NULL DEFAULT 'freeze',

  PRIMARY KEY("tx_id")
);

CREATE TABLE "operation_profit" (
  "profit_id" SERIAL    NOT NULL,
  "profit"    FLOAT     NOT NULL,
  "time"      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "status"    BOOLEAN   NOT NULL DEFAULT FALSE,

  PRIMARY KEY("profit_id")
);

CREATE TYPE DIVIDENDS_TYPE AS ENUM (
  'deposit',
  'withdraw'
);

CREATE TABLE "dividends" (
  "dividend_id" SERIAL         NOT NULL,
  "user_id"     INTEGER        NOT NULL  REFERENCES "users"("user_id"),
  "amount"      FLOAT          NOT NULL,
  "time"        TIMESTAMP      WITHOUT TIME ZONE DEFAULT NOW(),
  "type"        DIVIDENDS_TYPE NOT NULL DEFAULT 'deposit';

  PRIMARY KEY("dividend_id")
);

CREATE TYPE JACKPOT_TYPE AS ENUM (
  'random',
  'bet_amount'
);

CREATE TABLE "jackpots" (
  "payment_id" SERIAL       NOT NULL,
  "user_id"    INTEGER      NOT NULL REFERENCES "users"("user_id"),
  "type"       JACKPOT_TYPE NOT NULL,
  "place"      INTEGER      NOT NULL,
  "prize"      FLOAT,
  "status"     BOOLEAN      NOT NULL,
  "time"       TIMESTAMP    WITHOUT TIME ZONE DEFAULT NOW(),

  PRIMARY KEY("payment_id")
);
