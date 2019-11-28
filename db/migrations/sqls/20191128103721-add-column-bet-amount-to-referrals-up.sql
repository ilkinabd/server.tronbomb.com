ALTER TABLE referrals
ADD "bet_amount" FLOAT NOT NULL DEFAULT 0;

UPDATE referrals
SET "bet_amount" = "amount" * 1000;
