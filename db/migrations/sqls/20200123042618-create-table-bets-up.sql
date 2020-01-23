CREATE TABLE "bets" (
    "id" SERIAL NOT NULL,
    "wallet" CHAR(34) NOT NULL,
    "bet" FLOAT NOT NULL,
    "prize" FLOAT,
    "time" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    "symbol" SYMBOL NOT NULL DEFAULT 'TRX',
    PRIMARY KEY ("id")
);

