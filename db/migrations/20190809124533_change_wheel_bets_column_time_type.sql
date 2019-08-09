ALTER table wheel_bets
ALTER column time type timestamp without time zone
USING current_date + time;
