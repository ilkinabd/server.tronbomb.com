ALTER TABLE "operation_profit"
RENAME COLUMN "profit" TO "amount";

ALTER TABLE "operation_profit"
DROP COLUMN "balance";

ALTER TABLE "operation_profit"
ALTER COLUMN "date" TYPE DATE;

ALTER TABLE "operation_profit"
RENAME COLUMN "time" TO "date";
