ALTER TABLE wheel_bets
ALTER COLUMN "time" type timestamp without time zone
USING current_date + "time";
