ALTER TABLE "wheel"
ADD COLUMN "symbol" SYMBOL NOT NULL DEFAULT 'TRX';

UPDATE "wheel" SET "symbol" = 'BOMB'
WHERE "token_id" = 1;

ALTER TABLE "wheel"
DROP COLUMN "token_id";

--------------------------------------------------------------------------------

DROP TABLE "tokens";
