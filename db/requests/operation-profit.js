module.exports = {
  add: `
      INSERT INTO "operation_profit" ("profit")
      VALUES ($profit)
      RETURNING "profit_id" AS "id";`,

  'get-minus': `
      SELECT SUM(CASE WHEN COALESCE("profit", 0) < 0 THEN "profit" END ) AS "value"  
      FROM "operation_profit"`,

  'get-no-complete': `
      SELECT COALESCE(SUM("profit"), 0) AS "value"
      FROM "operation_profit"
      WHERE "status" = FALSE;`,

  'set-complete-all': `
      UPDATE "operation_profit"
      SET "status" = TRUE;`,
};
