CREATE TYPE NEW_FREEZE_STATUS AS ENUM (
  'cancel',
  'awaiting',
  'complete'
);

ALTER TABLE "freeze"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "freeze"
ALTER COLUMN "status" TYPE NEW_FREEZE_STATUS
USING "status"::TEXT::NEW_FREEZE_STATUS;

ALTER TABLE "freeze"
ALTER COLUMN "status" SET DEFAULT 'awaiting';

DROP TYPE FREEZE_STATUS;

ALTER TYPE NEW_FREEZE_STATUS RENAME TO FREEZE_STATUS;

--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION GET_USER_ID(CHAR(34))
RETURNS INTEGER AS
$$
  SELECT "user_id" FROM "users"
  WHERE "wallet" = $1;
$$
LANGUAGE sql;

--------------------------------------------------------------------------------

ALTER TABLE "freeze" ALTER COLUMN "hash" DROP NOT NULL;
