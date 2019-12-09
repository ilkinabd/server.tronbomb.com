CREATE TABLE "jackpot_history" (
  "jackpot_history_id" INTEGER NOT NULL,
  "user_id"            INTEGER NOT NULL REFERENCES "users"("user_id"),
  "prize"              FLOAT,
  "popup_shown"        BOOLEAN NOT NULL DEFAULT FALSE,

  PRIMARY KEY("jackpot_history_id")
)
