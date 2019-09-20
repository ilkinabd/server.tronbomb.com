# Server
v0.10.7.2 Sep 20, 2019

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
* [Endpoints List](./docs/Endpoints.md)

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
  CORS_TRUST        : '*'                          # CORS trust hosts
  PG_HOST           : 127.0.0.1                    # Postgres host
  PG_USER           : postgres                     # Postgres user
  PG_PORT           : 5432                         # Postgres port
  PG_PASS           : pass1234                     # Postgres password
  NODE              : http://localhost:3000        # Node endpoint
  NODE_TOKEN        : dhgf...fiew                  # Node security token
  ADMIN_TOKEN       : TFGY...ubaj                  # Admin access token
  WHEEL_START_BLOCK : 1501511                      # Wheel start block
  WHEEL_DURATION    : 10                           # Wheel duration
  DICE_RTP          : 0.98                         # Dice game RTP
  GET_RESPONSE_TOKEN: rhbd...wd3lm                 # GetResponse service token
  GET_RESPONSE_KEY  : 12345                        # GetResponse service key
  REFERRER_PROFIT   : 0.0015                       # Referrel profit multiplier
  MIN_WITHDRAW      : 10                           # Referrel profit min withdraw
  MIN_MINE          : 1                            # Min mine amount
  WITHDRAW_FEE      : 1                            # Referrel profit withdraw fee
  TOKENS            : TRX,BOMB                     # Available tokens
  DECIMAL           : 2                            # Tokens decimal
  TRONWEB_DELAY       : 70000                      # Tronweb updates delay

  MINING:
    START      : '2019-08-26T12:00:00.000Z'        # Start mining time
    START_LEVEL: 50                                # Start mining level
    DELTA      : 10                                # Mining level delta
    PROFIT:                                        # Mining funds profit
      team              : 0.4300
      random-jackpot    : 0.0175
      bet-amount-jackpot: 0.0175
      referral-rewards  : 0.0050
      auction           : 0.2000

  FREEZE:
    DELAY     : 120000                             # Unfreeze BOMB delay
    INTERVAL  : 5000                               # Unfreeze BOMB worker interval
    FUND_DELAY: 300000                             # Withdraw and freeze fonds tokens < FUND_DELAY > before dividence

  DIVIDENDS:
    START      : '2019-08-26T12:00:00.000Z'        # Start dividends program
    INTERVAL   : 600000                            # Dividends payout interval
    MIN_PROFIT : 100                               # Min operation profit to provide dividends distribution
    MIN_BALANCE: 5                                 # Min contract balance

  # Buy Back
  BUY_BACK_WALLET: TGNR...dwNM                     # Buy Back wallet address

  CHAT:
    GOOGLE_ID    : 7671...googleusercontent.com    # Google client id
    GOOGLE_SECRET: cOZ0...O6_C                     # Google secret
    FB_ID        : 3720...2071                     # Facebook client id
    FB_SECRET    : 38d3...2c87                     # Facebook secret
    ADMINS       : ['1175...5859',...]             # Chat admin ids

  JACKPOTS:
    ACTIVE     : TRUE                              # Jackpots status
    DELAY      : 120000                            # Delay to payout before dividends distribution
    MIN_BET_SUM: 10                                # Min bet sum for random jackpot
    MIN_FUND   : 10                                # Min jackpot fund balance
    MAX_FUND   : 200                               # Max jackpot fund balance
    PLACES     : 5                                 # Winners count
    PRIZES     : [0.5,0.2,0.15,0.09,0.06]          # Places percents

  AUCTION:
    ACTIVE       : TRUE                            # Auction status
    START        : '2019-08-28T12:00:00.000Z'      # Start of first auction
    INTERVAL     : 600000                          # Interval between auctions
    BET_STEP     : 1                               # Min bet diffeerence
    MAX_FUND     : 1000                            # Max auction fund balance
    WINNERS_COUNT: 10                              # Winners count
    PRIZES: [0.7,0.05,0.049, ... ,0.003,0.002]     # Places percents
```

Powered by 2019 © MaxieMind for © TronBomb.
