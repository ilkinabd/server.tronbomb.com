module.exports = {
  'add': `
      INSERT INTO messages (
        create_at,
        wallet,
        text
      ) VALUES (
        $createAt,
        $wallet,
        $text
      ) RETURNING message_id as "id";`,

  'get-history': `
      SELECT 
        message_id as "messageId",
        create_at as "createAt",
        text,
        wallet
      FROM (
        SELECT * 
        FROM messages 
        ORDER BY message_id DESC 
        LIMIT 50
      ) AS lastMessages
      ORDER BY message_id ASC;`,
};
