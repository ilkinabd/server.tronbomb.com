ALTER TABLE "ref_withdraws"
RENAME COLUMN "time" TO "date";

ALTER TABLE "ref_withdraws"
ALL COLUMN "code" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "ref_payments"
RENAME COLUMN "time" TO "date";
