CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "img" VARCHAR(255),
    "label" VARCHAR(255),
    "is_flash" BOOLEAN,
    "is_device" BOOLEAN,
    "is_vertical" BOOLEAN,
    "external_id" INTEGER,
    "provider" VARCHAR(255) PRIMARY KEY ("id"),
    UNIQUE ("provider")
);