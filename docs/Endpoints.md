# Endpoints List
v0.9.6+

## Auction

| Endpoint        | Type | Description                 |
| --------------- | ---- | --------------------------- |
| `/auction/fund` | GET  | Get current auction params. |

## BOMB

| Endpoint                 | Type | Description                          |
| ------------------------ | ---- | ------------------------------------ |
| `/bomb/burn_txs`         | GET  | Get all burn txs.                    |
| `/bomb/total_burn`       | GET  | Get total burn sum.                  |
| `/bomb/total_mined`      | GET  | Get total mined sum.                 |
| `/bomb/total_freeze`     | GET  | Get total freeze sum.                |
| `/bomb/mining_level`     | GET  | Get mining level and params.         |
| `/bomb/buy_back_balance` | GET  | Get **Buy Back** wallet and balance. |
| `/bomb/history/freeze`   | GET  | Get all freeze txs.                  |
| `/bomb/history/unfreeze` | GET  | Get all unfreeze txs.                |

## Chat

| Endpoint                 | Type | Description            |
| ------------------------ | ---- | ---------------------- |
| `/chat/add`              | POST | Add new ban.           |
| `/chat/get_ban_status`   | GET  | Get wallet ban status. |

## Dividends

| Endpoint             | Type | Description                    |
| -------------------- | ---- | ------------------------------ |
| `/dividends/info`    | GET  | Dividends distribution params. |
| `/dividends/history` | GET  | Get dividends history.         |

## Portal

| Endpoint                  | Type | Description                       |
| ------------------------- | ---- | --------------------------------- |
| `/portal/configs`         | GET  | Get smart contracts addresses.    |
| `/portal/total_bet_prize` | GET  | Get total bets and total win sum. |
| `/portal/subscribe`       | POST | Subscribe to the newsletter.      |

## Referral

| Endpoint                          | Type | Description                         |
| --------------------------------- | ---- | ----------------------------------- |
| `/referral/get_id`                | GET  | Get referral id by wallet.          |
| `/referral/set_id`                | POST | Set referral id by wallet.          |
| `/referral/get_wallet`            | GET  | Get wallet by referral id.          |
| `/referral/get_referrals`         | GET  | Get referrals by wallet.            |
| `/referral/get_referrals_count`   | GET  | Get referrals count by wallet.      |
| `/referral/get_referrer`          | GET  | Get referrer by wallet.             |
| `/referral/set_referrer`          | POST | Set referrer to user by wallet.     |
| `/referral/get_profit`            | GET  | Get referrals profit by wallet.     |
| `/referral/get_referral_payments` | GET  | Withdraw profit operations history. |
| `/referral/withdraw_txs`          | GET  | Withdraw profit operations history. |

## User

| Endpoint                  | Type | Description                                |
| ------------------------- | ---- | ------------------------------------------ |
| `/user/level`             | GET  | Get level by wallet.                       |
| `/user/total_bet`         | GET  | Get total bet sum by wallet.               |
| `/user/total_win`         | GET  | Get total win sum by wallet.               |
| `/user/total_mine`        | GET  | Get total mine sum by wallet.              |
| `/user/total_freeze`      | GET  | Get total freeze sum by wallet.            |
| `/user/total_profit`      | GET  | Get total dividends profit sum by wallet.  |
| `/user/history/dice`      | GET  | Get dice history by wallet.                |
| `/user/history/wheel`     | GET  | Get wheel history by wallet.               |
| `/user/history/freeze`    | GET  | Get freeze history by wallet.              |
| `/user/history/unfreeze`  | GET  | Get unfreeze history by wallet.            |
| `/user/awaiting_unfreeze` | GET  | Get awaiting unfreeze operation by wallet. |
