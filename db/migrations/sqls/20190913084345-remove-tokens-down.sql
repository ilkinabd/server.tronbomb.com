ALTER TABLE "wheel"
ADD COLUMN "token_id" INTEGER NOT NULL DEFAULT '0';

UPDATE "wheel" SET "token_id" = 1
WHERE "symbol" = 'BOMB';

ALTER TABLE "wheel"
DROP COLUMN "symbol";

--------------------------------------------------------------------------------

CREATE TABLE "tokens" (
  "token_id" INTEGER     NOT NULL,
  "address"  CHAR(34),
  "SYMBOL"   VARCHAR(10) NOT NULL,
  "NAME"     VARCHAR(25) NOT NULL,
  "DECIMAL"  INTEGER NOT NULL,

  PRIMARY KEY("token_id"),
  UNIQUE("address")
);

INSERT INTO "tokens"
VALUES (0, NULL, 'TRX', 'TRON network token', 6);

INSERT INTO "tokens"
VALUES (1, NULL, 'BOMB', 'BOMB token', 6);
