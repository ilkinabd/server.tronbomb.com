module.exports = {
  'get-symbol': `
      SELECT "SYMBOL" as "value"
      FROM "tokens"
      WHERE "token_id" = $tokenId;`,

  'get-all': `
      SELECT * FROM "tokens";`,
};
