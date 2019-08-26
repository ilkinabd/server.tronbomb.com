# BOMB integration

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

2. Get balance.

```
...

let portalContract;

...

portalContract = await tronWeb.contract().at(< portal address >);

...

const getBalance = async(wallet) => {
  const payload = await portalContract.balanceOf(wallet).call()
    .catch(console.error);

  const balance = payload.amount / 10 ** 6;
  return balance;
}

...

console.log(await getBalance('THnUkSQpPMpXMRSRNywrn5qpgrN7oLvSHQ'));

...
```

3. Freeze.

```
...

const processError = (payload) => {
  const output = payload.output.contractResult[0];
  const message = output.slice(136, output.indexOf('2e') + 2);
  const error = (!message) ? 'FAILED.' : tronWeb.toAscii(message);
  console.log(error);
}

...

// period in days
const freeze = async(amount, period) => {
  const freezeAmount = amount * 10 ** 6;

  const result = await portalContract.freeze(freezeAmount, period).send({
    shouldPollResponse: true,
  }).catch(processError);

  return result;
}

...

console.log(await freeze(10, 2));

...
```
