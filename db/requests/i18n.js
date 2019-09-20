module.exports = {
  'get-languages': `
      SELECT ARRAY_AGG("language") AS "value"
      FROM "i18n";`,

  'get-path': `
      SELECT "path" AS "value"
      FROM "i18n"
      WHERE "language" = $language;`,
};
