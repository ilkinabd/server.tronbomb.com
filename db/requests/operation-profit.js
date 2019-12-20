module.exports = {
  add: `
      INSERT INTO "operation_profit" ("profit")
      VALUES ($profit)
      RETURNING "profit_id" AS "id";`,

  'get-minus': `
      SELECT (CASE WHEN COALESCE("profit", 0) < 0 THEN "profit" ELSE 0 END) AS "value" 
      FROM "operation_profit" order by "profit_id" DESC LIMIT 1;`,

  'get-no-complete': `
      SELECT COALESCE(SUM("profit"), 0) AS "value"
      FROM "operation_profit"
      WHERE "status" = FALSE;`,

  'set-complete-all': `
      UPDATE "operation_profit"
      SET "status" = TRUE;`,
};
