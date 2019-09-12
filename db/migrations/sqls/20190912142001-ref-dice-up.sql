CREATE OR REPLACE FUNCTION GET_USER_ID(CHAR(34))
RETURNS INTEGER AS
$$
  INSERT INTO "users" ("wallet")
  SELECT $1
  WHERE NOT EXISTS (SELECT * FROM "users" WHERE "wallet" = $1);
  SELECT "user_id" FROM "users" WHERE "wallet" = $1;
$$
LANGUAGE sql;
