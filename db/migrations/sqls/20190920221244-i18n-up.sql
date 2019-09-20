CREATE TABLE "i18n" (
  "loc_id"   SERIAL       NOT NULL,
  "language" VARCHAR(25)  NOT NULL,
  "path"     VARCHAR(100) NOT NULL,

  PRIMARY KEY("loc_id"),
  UNIQUE("language")
);
