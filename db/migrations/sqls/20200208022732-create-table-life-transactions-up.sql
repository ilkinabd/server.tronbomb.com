CREATE TABLE "life" (
    "id" serial NOT NULL,
    "wallet" char(34),
    "amount" FLOAT,
    "level" FLOAT,
    "time" timestamp WITHOUT time zone DEFAULT now(),
    "hash" varchar(255),
    "life" FLOAT,
    "withdrawn" boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("id")
);

