ALTER TABLE "ref_withdraws"
RENAME COLUMN "date" TO "time";

ALTER TABLE "ref_withdraws"
DROP COLUMN "code";

ALTER TABLE "ref_payments"
RENAME COLUMN "date" TO "time";
