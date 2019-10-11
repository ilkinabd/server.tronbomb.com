# Endpoints List
v0.10.15+

## Models

**wallet**
```
{
  wallet: < string, alphanum, length(34) >
}
```

**refId**
```
{
  refId: < string, alphanum, length(6), uppercase >
}
```

**mail**
```
{
  mail: < string, regex, max(60) >
}
```

**language**
```
{
  language: < string, alphanum >
}
```

**jackpotWinner**
```
{
  wallet: < string, alphanum, length(34) >
  place: < number, integer, min(1) >
}
```

**msg**
```
{
  data: < object >
}
```

**status**
```
{
  status: < boolean >
}
```

**setBan**
```
{
  index: < string, numeric, length(21) >
  reason: < string >
  endTime: < date >
}
```

**setRef**
```
{
  wallet: < string, alphanum, length(34) >
  refId: < string, alphanum, length(6), uppercase >
}
```

## BOMB

| Endpoint                  | Model | Type | Description                          |
| ------------------------- | ----- | ---- | ------------------------------------ |
| `/bomb/burn_txs`          |       | GET  | Get all burn txs.                    |
| `/bomb/total_burn`        |       | GET  | Get total burn sum.                  |
| `/bomb/total_mined`       |       | GET  | Get total mined sum.                 |
| `/bomb/total_freeze`      |       | GET  | Get total freeze sum.                |
| `/bomb/buy_back_balance`  |       | GET  | Get **Buy Back** wallet and balance. |
| `/bomb/history/freeze`    |       | GET  | Get all freeze txs.                  |
| `/bomb/history/unfreeze`  |       | GET  | Get all unfreeze txs.                |
| `/bomb/history/dividends` |       | GET  | Get all dividends txs.               |

## Chat

| Endpoint                 | Model  | Type | Description                   |
| ------------------------ | ------ | ---- | ----------------------------- |
| `/chat/google/user`      |        | POST | Get google user params.       |
| `/chat/facebook/user`    |        | POST | Get facebook user params.     |
| `/chat/google/send`      | msg    | POST | Send google new message.      |
| `/chat/facebook/send`    | msg    | POST | Send facebook new message.    |
| `/chat/google/set_ban`   | setBan | POST | Set google user ban status.   |
| `/chat/facebook/set_ban` | setBan | POST | Set facebook user ban status. |

## Portal

| Endpoint                                 | Model         | Type | Description                              |
| ---------------------------------------- | ------------- | ---- | ---------------------------------------- |
| `/portal/configs`                        |               | GET  | Get smart contracts addresses.           |
| `/portal/mining_level`                   |               | GET  | Get mining level and params.             |
| `/portal/total_bet_prize`                |               | GET  | Get total bets and total win sum.        |
| `/portal/dividends_params`               |               | GET  | Get dividends distribution params.       |
| `/portal/auction_params`                 |               | GET  | Get current auction params.              |
| `/portal/subscribe`                      | mail          | POST | Subscribe to the newsletter.             |
| `/portal/contracts/params`               |               | GET  | Get portal contract params.              |
| `/portal/contracts/main_status`          |               | GET  | Get main status param.                   |
| `/portal/contracts/set_main_status`      | status        | POST | Set main status param.                   |
| `/portal/jackpots/params`                |               | GET  | Get jackpot params.                      |
| `/portal/jackpots/random_winner`         | jackpotWinner | POST | Set random jackpot winner manually.      |
| `/portal/jackpots/set_random_winner`     |               | GET  | Get random jackpot manually winner.      |
| `/portal/jackpots/history/random`        |               | GET  | Get random jackpot payments history.     |
| `/portal/jackpots/history/bet_amount`    |               | GET  | Get bet amount jackpot payments history. |
| `/portal/jackpots/set_random_status`     | status        | POST | Set Random status.                       |
| `/portal/jackpots/set_bet_amount_status` | status        | POST | Set Bet Amount status.                   |

## Referral

| Endpoint                     | Model  | Type | Description                     |
| ---------------------------- | ------ | ---- | ------------------------------- |
| `/referral/id`               | wallet | GET  | Get referral id by wallet.      |
| `/referral/set_id`           | setRef | POST | Set referral id by wallet.      |
| `/referral/wallet`           | refId  | GET  | Get wallet by referral id.      |
| `/referral/referrals`        | wallet | GET  | Get referrals by wallet.        |
| `/referral/total_referrals`  | wallet | GET  | Get referrals count by wallet.  |
| `/referral/referrers`        | wallet | GET  | Get referrers by wallet.        |
| `/referral/set_referrer`     | setRef | POST | Set referrer to user by wallet. |
| `/referral/profit`           | wallet | GET  | Get referrals profit by wallet. |
| `/referral/history/income`   | wallet | GET  | Income profit history.          |
| `/referral/history/withdraw` | wallet | GET  | Withdraw profit history.        |

## User

| Endpoint                   | Model  | Type | Description                                |
| -------------------------- | ------ | ---- | ------------------------------------------ |
| `/user/level`              | wallet | GET  | Get level by wallet.                       |
| `/user/total_bet`          | wallet | GET  | Get total bet sum by wallet.               |
| `/user/total_win`          | wallet | GET  | Get total win sum by wallet.               |
| `/user/total_mine`         | wallet | GET  | Get total mine sum by wallet.              |
| `/user/total_freeze`       | wallet | GET  | Get total freeze sum by wallet.            |
| `/user/total_dividends`    | wallet | GET  | Get total dividends profit by wallet.      |
| `/user/awaiting_unfreeze`  | wallet | GET  | Get awaiting unfreeze operation by wallet. |
| `/user/awaiting_dividends` | wallet | GET  | Get awaiting dividends by wallet.          |
| `/user/history/dice`       | wallet | GET  | Get dice history by wallet.                |
| `/user/history/wheel`      | wallet | GET  | Get wheel history by wallet.               |
| `/user/history/freeze`     | wallet | GET  | Get freeze history by wallet.              |
| `/user/history/unfreeze`   | wallet | GET  | Get unfreeze history by wallet.            |
| `/user/history/dividends`  | wallet | GET  | Get dividends history by wallet.           |

## i18n

| Endpoint          | Model    | Type | Description             |
| ----------------- | -------- | ---- | ----------------------- |
| `/i18n/language`  | language | GET  | Get language json.      |
| `/i18n/languages` |          | GET  | Get all languages list. |
