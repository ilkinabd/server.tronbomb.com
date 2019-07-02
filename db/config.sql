CREATE TABLE messages (
  "message_id"  SERIAL        NOT NULL,
  "create_at"   TIMESTAMP(6),
  "wallet"      CHAR(34)      NOT NULL,
  "text"        TEXT          NOT NULL
);
