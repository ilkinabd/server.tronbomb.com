# Server
v0.9.3 Aug 28, 2019

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
* [Referral system](./docs/Referral.md)

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
  PG_HOST           : 127.0.0.1                    # Postgres host
  PG_USER           : postgres                     # Postgres user
  PG_PORT           : 5432                         # Postgres port
  PG_PASS           : pass1234                     # Postgres password
  NODE              : http://localhost:3000        # Node endpoint
  NODE_TOKEN        : dhgf...fiew                  # Node security token
  ADMIN_TOKEN       : TFGY...ubaj                  # Admin access token
  CHAT_USER_LEVEL   : 5                            # User level for chat
  WHEEL_START_BLOCK : 1501511                      # Wheel start block
  WHEEL_DURATION    : 10                           # Wheel duration
  DICE_RTP          : 0.98                         # Dice game RTP
  GET_RESPONSE_TOKEN: rhbd...wd3lm                 # GetResponse service token
  GET_RESPONSE_KEY  : 12345                        # GetResponse service key
  REFERRER_PROFIT   : 0.0015                       # Referrel profit multiplier
  MIN_WITHDRAW      : 10                           # Referrel profit min withdraw
  MAX_WITHDRAW      : 1000                         # Referrel profit max withdraw
  WITHDRAW_FEE      : 1                            # Referrel profit withdraw fee

  UNFREEZE_TIME     : 86400000                     # Unfreeze BOMB amount

  START_MINING      : '2019-08-26T12:00:00.000Z'   # Start mining time
  START_MINING_LEVEL: 50                           # First mining level
  MINING_LEVEL_DELTA: 10                           # Mining level delta
  # player, ad, random-jackpot, bet-amount-jackpot, technical, referral-rewards, team, auction
  MINING_PROFIT: 1.0000,0.1330,0.0170,0.0170,0.0800,0.0025,0.2170,0.2000

  PLATFORM_BALANCE    : 10000                      # Min Platform contract balance
  MIN_OPERATION_PROFIT: 100                        # Min profit for withdraw

  AUCTION:
    START_AUCTION: '2019-08-28T12:00:00.000Z'      # Start first auction time
    ENABLED: true                                  # Auction switch
    WINNERS_COUNT: 10                              # Auction winners count switch
    FUND_LIMIT: 1000                               # Auction fund limit
    PAYOUT_COEFS:                                  # Payout coefs
      0: 0.7
      1: 0.05
      2: 0.049
      3: 0.048
      4: 0.047
      5: 0.046
      6: 0.045
      7: 0.01
      8: 0.003
      9: 0.002
```

Powered by 2019 © MaxieMind for © TronBomb.
