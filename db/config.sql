CREATE TABLE messages (
  "message_id"  SERIAL        NOT NULL,
  "create_at"   TIMESTAMP(6),
  "wallet"      VARCHAR(40)   NOT NULL,
  "text"        VARCHAR(500)  NOT NULL
);
