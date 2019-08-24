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

let bombContract;

...

bombContract = await tronWeb.contract().at(< portal address >);

...

const getBalance = async(wallet) => {
  const payload = await bombContract.balanceOf(wallet).call()
    .catch(console.error);

  const balance = payload.amount / 10 ** 6;
  return balance;
}

...
```

