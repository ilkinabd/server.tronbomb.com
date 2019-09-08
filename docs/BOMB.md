# BOMB integration

### 1. Get **portal** contract address.

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

### 2. Get balance.

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

### 3. Transfer.

```
...

const processError = (payload) => {
  const output = payload.output.contractResult[0];
  const message = output.slice(136, output.indexOf('2e') + 2);
  const error = (!message) ? 'FAILED.' : tronWeb.toAscii(message);
  console.log(error);
}

...

const transfer = async(to, amount) => {
  const transferAmount = Math.floor(amount * 10 ** 6);

  const result = await portalContract.transfer(to, transferAmount).send({
    shouldPollResponse: true,
  }).catch(processError);

  return result;
}

...

console.log(await transfer('TMzciXEzxGvr74Kh7xSarvqf7RKPyWpeM8', 10));

...
```

### 4. Mine.

```
...

let operationsContract;

...

operationsContract = await tronWeb.contract().at(< operations address >);

...

const processError = (payload) => {
  const output = payload.output.contractResult[0];
  const message = output.slice(136, output.indexOf('2e') + 2);
  const error = (!message) ? 'FAILED.' : tronWeb.toAscii(message);
  console.log(error);
}

...

const mine = async() => {
  await operationsContract.mine()
    .send({ shouldPollResponse: true })
    .catch(processError);

  return true;
}

...
```

### 5. Freeze and unfreeze.

```
...

const freeze = async(amount) => {
  const freezeAmount = Math.floor(amount * 10 ** 6);

  const result = await portalContract.freeze(freezeAmount).send({
    shouldPollResponse: true,
  }).catch(processError);

  return result;
}

const unfreeze = async() => {
  const result = await portalContract.unfreezeAll().send({
    shouldPollResponse: true,
  }).catch(processError);

  return result;
}

...

console.log(await freeze(10));
console.log(await unfreeze());

...
```
