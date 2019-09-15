ALTER TABLE "users"
ADD COLUMN "mine" FLOAT NOT NULL DEFAULT 0;

--------------------------------------------------------------------------------

DROP TABLE "mining";
DROP TYPE MINING_TYPE;
