CREATE TABLE "messages" (
  "message_id" SERIAL       NOT NULL,
  "user_id"    INTEGER      NOT NULL REFERENCES "users"("user_id"),
  "create_at"  TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "data"       JSON         NOT NULL,

  PRIMARY KEY("message_id")
);

DROP TABLE "oauth_users";
DROP TABLE "chat";

--------------------------------------------------------------------------------

ALTER TABLE "bans"
ADD FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
