const db = require('@db');

setInterval(async() => {
  const bans = await db.bans.getActive();

  for (const ban of bans) {
    const { banId, endTime } = ban;
    const now = (new Date()).getTime();

    if (now > (new Date(endTime)).getTime())
      await db.bans.setStatus({ status: false, banId });
  }
}, 30000);
