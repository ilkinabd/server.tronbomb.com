CREATE TABLE "oauth_users" (
  "user_id" SERIAL       NOT NULL,
  "index"   CHAR(21)     NOT NULL UNIQUE,
  "name"    VARCHAR(40)  NOT NULL,

  PRIMARY KEY("user_id")
);

CREATE TABLE "chat" (
  "message_id" SERIAL    NOT NULL,
  "user_id"    INTEGER   NOT NULL REFERENCES "oauth_users"("user_id"),
  "data"       JSON      NOT NULL,
  "time"       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  PRIMARY KEY("message_id")
);

DROP TABLE "messages";

--------------------------------------------------------------------------------

ALTER TABLE "bans"
ADD FOREIGN KEY ("user_id") REFERENCES "oauth_users"("user_id");
