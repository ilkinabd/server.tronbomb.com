module.exports = {
  'get': `
      SELECT "value" -> 'value' AS "value"
      FROM "configs"
      WHERE "key" = $key;`,

  'set': `
      UPDATE "configs"
      SET "value" = JSONB_SET("value", '{value}', $value, true)
      WHERE "key" = $key;`,
};
