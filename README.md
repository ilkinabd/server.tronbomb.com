# Server
v0.8.6 Aug 24, 2019

Server for **TronBomb** games.

## Get Started

0. Install **node** v10+, **yarn**, **pm2** and **postgres** 10+.
1. Create database **tron_bomb_server**.
2. Crate **db/database.json** config file. Read **Config** part.
3. Run database migrations.

```
yarn migrate
```

4. Create **process.yml** config file. Read **Config** part.
5. Install packages and start.
```
yarn
yarn start
```
6. Stop and Restart tools
```
yarn stop
yarn restart
```
7. Logs and Errors tools
```
yarn logs
yarn errors
```

## Integration instructions

* [BOMB token](./docs/BOMB.md)
* [Dice game](./docs/Dice.md)
* [Wheel game](./docs/Wheel.md)

## Config

Use **db/database.json** config.

```
{
  "development": {
    "driver": "pg",
    "user": "postgres",
    "password": "pass1234",
    "host": "localhost",
    "database": "tron_bomb_server",
    "schema": "public"
  }
}
```

Use **process.yml** config.

```
name            : bomb-server
script          : server.js
log_date_format : YYYY-MM-DD HH:MM:SS Z
error_file      : /data/app/logs/node-app.stderr.log
out_file        : /data/app/logs/node-app.stdout.log
pid_file        : /home/app/.pm2/pids/bomb.pid
instances       : '1'
watch           : true
merge_logs      : true
autorestart     : true
env:
  NODE_ENV          : development
  NODE_URL          : localhost
  NODE_PORT         : 3000
  PG_HOST           : 127.0.0.1                    // Postgres host
  PG_USER           : postgres                     // Postgres user
  PG_PORT           : 5432                         // Postgres port
  PG_PASS           : pass1234                     // Postgres password
  NODE              : http://localhost:3000        // Node endpoint
  NODE_TOKEN        : dhgf...fiew                  // Node security token
  ADMIN_TOKEN       : TFGY...ubaj                  // Admin access token
  CHAT_USER_LEVEL   : 5                            // User level for chat
  WHEEL_START_BLOCK : 1501511                      // Wheel start block
  WHEEL_DURATION    : 10                           // Wheel duration
  DICE_RTP          : 0.98                         // Dice game RTP
  GET_RESPONSE_TOKEN: rhbd...wd3lm                 // GetResponse service token
  GET_RESPONSE_KEY  : 12345                        // GetResponse service key
  REFERRER_PROFIT   : 0.0015                       // Referrel profit multiplier
  MIN_WITHDRAW      : 10                           // Referrel profit min withdraw
  MAX_WITHDRAW      : 1000                         // Referrel profit max withdraw
  WITHDRAW_FEE      : 1                            // Referrel profit withdraw fee
```

Powered by 2019 © MaxieMind for © TronBomb.
