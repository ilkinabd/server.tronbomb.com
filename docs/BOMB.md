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
