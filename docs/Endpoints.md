# Endpoints List
v0.9.8+

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

**jackpotWinner**
```
{
  wallet: < string, alphanum, length(34) >
  place: < number, integer, min(1) >
}
```

**addBan**
```
{
  wallet: < string, alphanum, length(34) >
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

## Auction

| Endpoint        | Model | Type | Description                 |
| --------------- | ----- | ---- | --------------------------- |
| `/auction/fund` |       | GET  | Get current auction params. |

## BOMB

| Endpoint                  | Model | Type | Description                          |
| ------------------------- | ----- | ---- | ------------------------------------ |
| `/bomb/burn_txs`          |       | GET  | Get all burn txs.                    |
| `/bomb/total_burn`        |       | GET  | Get total burn sum.                  |
| `/bomb/total_mined`       |       | GET  | Get total mined sum.                 |
| `/bomb/total_freeze`      |       | GET  | Get total freeze sum.                |
| `/bomb/mining_level`      |       | GET  | Get mining level and params.         |
| `/bomb/buy_back_balance`  |       | GET  | Get **Buy Back** wallet and balance. |
| `/bomb/history/freeze`    |       | GET  | Get all freeze txs.                  |
| `/bomb/history/unfreeze`  |       | GET  | Get all unfreeze txs.                |
| `/bomb/history/dividends` |       | GET  | Get all dividends txs.               |

## Chat

| Endpoint                 | Model  | Type | Description            |
| ------------------------ | ------ | ---- | ---------------------- |
| `/chat/add`              | wallet | POST | Add new ban.           |
| `/chat/get_ban_status`   | addBan | GET  | Get wallet ban status. |

## Portal

| Endpoint                            | Model         | Type | Description                          |
| ----------------------------------- | ------------- | ---- | ------------------------------------ |
| `/portal/configs`                   |               | GET  | Get smart contracts addresses.       |
| `/portal/total_bet_prize`           |               | GET  | Get total bets and total win sum.    |
| `/portal/dividends_params`          |               | GET  | Get dividends distribution params.   |
| `/portal/random_jackpot_params`     |               | GET  | Get random jackpot params.           |
| `/portal/set_random_jackpot_winner` | jackpotWinner | POST | Set random jackpot winner manually.  |
| `/history/random_jackpot`           |               | GET  | Get random jackpot payments history. |
| `/portal/subscribe`                 | mail          | POST | Subscribe to the newsletter.         |

## Referral

| Endpoint                          | Model  | Type | Description                         |
| --------------------------------- | ------ | ---- | ----------------------------------- |
| `/referral/get_id`                | wallet | GET  | Get referral id by wallet.          |
| `/referral/set_id`                | setRef | POST | Set referral id by wallet.          |
| `/referral/get_wallet`            | refId  | GET  | Get wallet by referral id.          |
| `/referral/get_referrals`         | wallet | GET  | Get referrals by wallet.            |
| `/referral/get_referrals_count`   | wallet | GET  | Get referrals count by wallet.      |
| `/referral/get_referrer`          | wallet | GET  | Get referrer by wallet.             |
| `/referral/set_referrer`          | setRef | POST | Set referrer to user by wallet.     |
| `/referral/get_profit`            | wallet | GET  | Get referrals profit by wallet.     |
| `/referral/get_referral_payments` | wallet | GET  | Withdraw profit operations history. |
| `/referral/withdraw_txs`          | wallet | GET  | Withdraw profit operations history. |

## User

| Endpoint                  | Model  | Type | Description                                |
| ------------------------- | ------ | ---- | ------------------------------------------ |
| `/user/level`             | wallet | GET  | Get level by wallet.                       |
| `/user/total_bet`         | wallet | GET  | Get total bet sum by wallet.               |
| `/user/total_win`         | wallet | GET  | Get total win sum by wallet.               |
| `/user/total_mine`        | wallet | GET  | Get total mine sum by wallet.              |
| `/user/total_freeze`      | wallet | GET  | Get total freeze sum by wallet.            |
| `/user/total_dividends`   | wallet | GET  | Get total dividends profit by wallet.      |
| `/user/awaiting_unfreeze` | wallet | GET  | Get awaiting unfreeze operation by wallet. |
| `/user/history/dice`      | wallet | GET  | Get dice history by wallet.                |
| `/user/history/wheel`     | wallet | GET  | Get wheel history by wallet.               |
| `/user/history/freeze`    | wallet | GET  | Get freeze history by wallet.              |
| `/user/history/unfreeze`  | wallet | GET  | Get unfreeze history by wallet.            |
| `/user/history/dividends` | wallet | GET  | Get dividends history by wallet.           |
