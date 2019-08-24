# Wheel integration

## WS Events

* `wheel` - first event with wheel history (last 25 games).

```
{
  games: [
    {
      index: 39
      finishBlock: 1531211
      wallet: "TGNRoMMQpdjTbhscJ4qacrJFhXMm4WdwNM"
      level: 13
      bet: 100
      symbol: "TRX"
      sector: 2
      result: 5
      prize: 0
      time: "2019-08-11T15:50:22.324Z"
    },
    ...
  ]
}
```

* `wheel-start` - start new game info.

```
{
  index: 25,
  finishBlock: 1903079
}
```

* `wheel-bet` - finish game info.

```
{
  index: 25,
  wallet: "TGNRoMMQpdjTbhscJ4qacrJFhXMm4WdwNM",
  bet: 10,
  symbol: "BOMB",
  sector: 1,
  time: "2019-08-24T16:25:50.568Z"
}
```

* `wheel-stop-bets` - stop bets for this game.

```
{
  index: 25
}
```

* `wheel-finish` - finish game info.

```
{
  index: 25,
  result: 14,
  sector: 6
}
```

## Integration

1. Get **portal** contract address.

```
GET /portal/configs
```

Response:

```
{
  "status": "success",
  "contracts": [
    {
      "type": "portal",
      "address": "TMWN3qj7pKpZay8bkyH3LB6bF8S4JrFGUy",
      "title": "Portal"
    },
    ...
  ]
}
```

2. Take bet.

```
...

let portalContract;

...

portalContract = await tronWeb.contract().at(< portal address >);

...

const buildData = (sector) => {
  const sectorHex = tronWeb.toHex(sector).substring(2);

  const data = [
    `0x${'0'.repeat(64 - sectorHex.length)}${numberHex}`,
  ];

  return data;
}

const processError = (payload) => {
  const output = payload.output.contractResult[0];
  const message = output.slice(136, output.indexOf('2e') + 2);
  const error = (!message) ? 'FAILED.' : tronWeb.toAscii(message);
  console.log(error);
}

...

const takeBet = async(bet, sector) => {
  const callValue = bet * 10 ** 6;
  const data = buildData(sector);

  const result = await portalContract.takeBet(1, data).send({
    shouldPollResponse: true,
    callValue,
  }).catch(processError);

  const index = tronWeb.toDecimal(result.index);
  return index;
}

...

console.log(await takeBet(10, 1));

...

const takeBOMBBet = async(bet, sector) => {
  const betAmount = bet * 10 ** 6;
  const data = buildData(sector);

  const result = await portalContract.takeBOMBBet(1, betAmount, data).send({
    shouldPollResponse: true,
  }).catch(processError);

  const index = tronWeb.toDecimal(result.index);
  return index;
}

...

console.log(await takeBOMBBet(10, 1));

...
```

3. Get game **index** in `wheel-bet` events.

4. Get game **result** in `wheel-finish` events by game **index**.

## Fairness

1. Get **wheel** contract address.

```
GET /portal/configs
```

Response:

```
{
  "status": "success",
  "contracts": [
    ...
    {
      "type": "wheel",
      "address": "TTp5dHTirG1HzLUWX2pwZphDnXVt2LSWi6",
      "title": "Wheel (index: 1)"
    },
    ...
  ]
}
```

2. Check game.

```
...

let wheelContract;

...

wheelContract = await tronWeb.contract().at(< wheel address >);

...

const fairness = async(block) => {
  const hash = '0x' + (await tronWeb.trx.getBlock(block)).blockID;

  const payload = await wheelContract.rng(block, hash).call()
    .catch(console.error);

  const result = tronWeb.toDecimal(payload.result);
  return result;
}

...

console.log(await fairness(1149657));

...
```