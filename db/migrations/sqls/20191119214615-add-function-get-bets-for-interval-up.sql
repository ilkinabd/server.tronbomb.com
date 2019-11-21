CREATE OR REPLACE FUNCTION public.get_bets_for_interval()
 RETURNS TABLE(bet double precision, user_id integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF EXTRACT(HOUR FROM now()) >= 12 THEN
        RETURN QUERY SELECT d."bet", d."user_id" FROM "dice" d WHERE time between (date(now())||' 12:00')::timestamp and (date(now() + interval '1 day')||' 12:00')::timestamp
        UNION ALL SELECT w."bet", w."user_id" FROM "wheel" w WHERE time between (date(now())||' 12:00')::timestamp and (date(now() + interval '1 day')||' 12:00')::timestamp;
    ELSE
        RETURN QUERY SELECT d."bet", d."user_id" FROM "dice" d WHERE time between (date(now() - interval '1 day')||' 12:00')::timestamp and (date(now())||' 12:00')::timestamp
        UNION ALL SELECT w."bet", w."user_id" FROM "wheel" w WHERE time between (date(now() - interval '1 day')||' 12:00')::timestamp and (date(now())||' 12:00')::timestamp;
    END IF;
END;
$function$;
