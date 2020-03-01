CREATE TABLE "bets" (
    "id" serial NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users" ("user_id"),
    "bet" FLOAT NOT NULL,
    "prize" FLOAT,
    "time" timestamp WITHOUT time zone DEFAULT now(),
    "symbol" SYMBOL NOT NULL DEFAULT 'TRX',
    PRIMARY KEY ("id")
);

