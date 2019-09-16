module.exports = {
  'add': `
      INSERT INTO "operation_profit" ("profit")
      VALUES ($profit)
      RETURNING "profit_id" AS "id";`,

  'get-no-complete': `
      SELECT COALESCE(SUM("profit"), 0) AS "value"
      FROM "operation_profit"
      WHERE "status" = FALSE;`,

  'set-complete-all': `
      UPDATE "operation_profit"
      SET "status" = TRUE;`,
};
