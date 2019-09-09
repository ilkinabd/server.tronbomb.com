ALTER TABLE "operation_profit"
RENAME COLUMN "amount" TO "profit";

ALTER TABLE "operation_profit"
ADD COLUMN "balance" FLOAT NOT NULL DEFAULT 0;

ALTER TABLE "operation_profit"
ALTER COLUMN "date" TYPE TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE "operation_profit"
RENAME COLUMN "date" TO "time";
