ALTER TABLE "operation_profit"
RENAME COLUMN "profit" TO "amount";

ALTER TABLE "operation_profit"
ALTER COLUMN "date" TYPE DATE;

ALTER TABLE "operation_profit"
RENAME COLUMN "time" TO "date";

--------------------------------------------------------------------------------

DROP TYPE DIVIDENDS_TYPE;

ALTER TABLE "dividends"
DROP COLUMN "type";
