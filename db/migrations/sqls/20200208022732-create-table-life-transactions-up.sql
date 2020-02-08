CREATE TABLE "life" (
    "id" serial NOT NULL,
    "wallet" char(34) NOT NULL,
    "amount" FLOAT NOT NULL,
    "level" FLOAT,
    "time" timestamp WITHOUT time zone DEFAULT now(),
    "life" FLOAT NOT NULL,
    "withdrawn" boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("id")
);

