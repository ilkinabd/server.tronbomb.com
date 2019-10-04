CREATE TABLE "configs" (
  "key"   VARCHAR(30) NOT NULL,
  "value" JSONB       NOT NULL,

  UNIQUE("key")
);

INSERT INTO "configs" VALUES
  ('RANDOM_JACKPOT_STATUS', '{ "value": true }'),
  ('BET_AMOUNT_JACKPOT_STATUS', '{ "value": true }');
