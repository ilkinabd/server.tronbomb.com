# Dice integration

## WS Events

* `dice` - first event with dice history (last 25 games).

```
{
  games: [
    {
      index: 39,
      finishBlock: 1900943,
      wallet: "TGNRoMMQpdjTbhscJ4qacrJFhXMm4WdwNM",
      level: 13,
      bet: 10,
      symbol: "BOMB",
      number: 30,
      roll: "over",
      result: 38,
      prize: 16.0553191489362,
      time: "2019-08-24T12:14:13.182Z"
    },
    ...
  ]
}
```

* `dice-finish` - new finished game.

```
{
  games: [
    {
      index: 41,
      finishBlock: 1901225,
      wallet: "TGNRoMMQpdjTbhscJ4qacrJFhXMm4WdwNM",
      level: 13,
      bet: 10,
      symbol: "BOMB",
      number: 30,
      roll: "over",
      result: 11,
      prize: 0,
      time: "2019-08-24T12:14:13.182Z"
    }
  ]
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

const buildData = (number, roll) => {
  const numberHex = tronWeb.toHex(number).substring(2);
  const rollHex = tronWeb.toHex(roll).substring(2);

  const data = [
    `0x${'0'.repeat(64 - numberHex.length)}${numberHex}`,
    `0x${'0'.repeat(64 - rollHex.length)}${rollHex}`,
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

const takeBet = async(bet, number, roll) => {
  const callValue = bet * 10 ** 6;
  const data = buildData(number, roll);

  const result = await portalContract.takeBet(0, data).send({
    shouldPollResponse: true,
    callValue,
  }).catch(processError);

  const index = tronWeb.toDecimal(result.index);
  return index;
}

...

console.log(await takeBet(10, 30, 1));

...

const takeBOMBBet = async(bet, number, roll) => {
  const betAmount = bet * 10 ** 6;
  const data = buildData(number, roll);

  const result = await portalContract.takeBOMBBet(0, betAmount, data).send({
    shouldPollResponse: true,
  }).catch(processError);

  const index = tronWeb.toDecimal(result.index);
  return index;
}

...

console.log(await takeBOMBBet(10, 30, 1));

...
```

3. Get game **index** as a result of `takeBet()` or `takeBOMBBet()` function.

4. Find game **result** in `dice-finish` events by game **index**.
