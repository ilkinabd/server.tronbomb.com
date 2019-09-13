CREATE OR REPLACE FUNCTION GET_USER_ID(CHAR(34))
RETURNS INTEGER AS
$$
  SELECT "user_id" FROM "users"
  WHERE "wallet" = $1;
$$
LANGUAGE sql;

--------------------------------------------------------------------------------

ALTER TABLE "dice"
ADD COLUMN "token_id" INTEGER NOT NULL DEFAULT '0';

UPDATE "dice" SET "token_id" = 1
WHERE "symbol" = 'BOMB';

ALTER TABLE "dice"
DROP COLUMN "symbol";

DROP TYPE SYMBOL;
