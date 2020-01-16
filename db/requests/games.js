module.exports = {
  add: `
      INSERT INTO "games" (
          "name",
          "img",
          "label",
          "is_flash",
          "device",
          "is_vertical",
          "external_id"
      ) VALUES (
          $name,
          $img,
          $label,
          $isFlash,
          $device,
          $isVertical,
          $externalId
      ) RETURNING "id" AS "id";`,

  'get-by-label': `SELECT * FROM "games" WHERE "label" = $label;`,

  'get-popular': `SELECT * FROM "games" WHERE "name" IN ('Gonzos Quest','Buffalo','Blood Suckers') 
               AND "device" IN(0,2);`,

  truncate: `TRUNCATE "games" RESTART IDENTITY;`,
};
