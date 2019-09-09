module.exports = {
  'add': `
      INSERT INTO "operation_profit" ("balance", "profit")
      VALUES ($balance, $profit)
      RETURNING "profit_id" as "id";`,

  'get-last-balance': `
      SELECT "balance" as "value"
      FROM "operation_profit"
      ORDER BY "time" DESC
      LIMIT 1;`,

  'get-no-complete': `
      SELECT COALESCE(SUM("profit"), 0) as "value"
      FROM "operation_profit"
      WHERE "status" = FALSE;`,

  'set-complete-all': `
      UPDATE "operation_profit"
      SET "status" = TRUE;`,
};
