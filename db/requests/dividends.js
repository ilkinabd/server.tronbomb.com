module.exports = {
  'add': `
    INSERT INTO "dividends" ("user_id", "amount")
    VALUES (
        (SELECT "user_id" FROM "users" WHERE "wallet" = $wallet),
        $amount
    ) RETURNING "dividend_id" as "id"`,
};
