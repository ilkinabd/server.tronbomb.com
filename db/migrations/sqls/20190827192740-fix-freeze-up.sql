CREATE TYPE FREEZE_TYPE AS ENUM (
  'freeze',
  'unfreeze'
);

ALTER TYPE FREEZE_STATUS RENAME VALUE 'active' TO 'awaiting';

ALTER TABLE "freeze" RENAME COLUMN "start" TO "time";
ALTER TABLE "freeze" DROP COLUMN "finish";
ALTER TABLE "freeze" ADD COLUMN "type" FREEZE_TYPE NOT NULL DEFAULT 'freeze';
