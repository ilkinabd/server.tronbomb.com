# Server
v0.7.3 Aug 6, 2019

Server for **TronBomb** games.

## Get Started

0. Install **node** v10+, **yarn** and **postgres** 10+.
1. Create database from config [db/config.sql](./db/config.sql).
2. Create **process.yml** config file. Read **Config** part.
3. Install packages and start.
```
yarn
yarn start
```
4. Stop and Restart tools
```
yarn stop
yarn restart
```
5. Logs and Errors tools
```
yarn logs
yarn errors
```

## Config

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
  GAME_RTP          : 0.98                         // Dice game RTP
  GET_RESPONSE_TOKEN: rhbd...wd3lm                 // GetResponse service token
  GET_RESPONSE_KEY  : 12345                        // GetResponse service key
  REFERRER_PROFIT   : 0.0015                       // Referrel profit multiplier
```

Powered by 2019 © MaxieMind for © TronBomb.
