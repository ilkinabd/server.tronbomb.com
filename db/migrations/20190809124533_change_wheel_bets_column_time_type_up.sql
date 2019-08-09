ALTER TABLE wheel_bets
ALTER COLUMN "time" type timestamp without time zone
USING current_date - interval '1 day' + "time";

ALTER TABLE dice_bets
ALTER COLUMN "time" type timestamp without time zone
USING current_date - interval '1 day' + "time";
