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

  'get-by-id': `SELECT * FROM "games" WHERE "external_id" = $externalId;`,

  'get-by-label': `SELECT * FROM "games" WHERE "label" = $label;`,

  'get-popular': `SELECT * FROM "games" WHERE "external_id" 
    IN (83, 1513, 299, 3013, 70, 1512, 179, 1519, 1504, 435, 
    3188, 4304, 86, 297, 4651, 4644, 4643, 4332, 4652, 436, 1505, 4169, 4164,
    306, 1509, 3077, 3194, 1515, 172, 27, 4587, 4385, 4589);`,

  'get-slots': `SELECT * FROM "games" WHERE "external_id" IN (3188, 3077, 172, 4589, 25, 26, 30);`,

  'get-table': `SELECT * FROM "games" WHERE "external_id" IN (3085, 4612, 3160);`,

  truncate: `TRUNCATE "games" RESTART IDENTITY;`,
};
