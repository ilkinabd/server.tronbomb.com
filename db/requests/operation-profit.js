module.exports = {
  'add': `
      INSERT INTO "operation_profit" ("amount")
      VALUES ($amount)
      RETURNING "profit_id" as "id";`,

  'get-no-complete': `
      SELECT COALESCE(SUM("amount"), 0) as "value"
      FROM "operation_profit"
      WHERE "status" = FALSE;`,

  'set-complete-all': `
      UPDATE "operation_profit"
      SET "status" = TRUE;`,
};
