module.exports = {
  add: `
      INSERT INTO "games" (
          "name",
          "img",
          "label",
          "is_flash",
          "is_device",
          "is_vertical",
          "external_id"
      ) VALUES (
          $name,
          $img,
          $label,
          $isFlash,
          $isDevice,
          $isVertical,
          $externalId
      ) RETURNING "id" AS "id";`,
  truncate: `TRUNCATE "games" RESTART IDENTITY;`,
};
