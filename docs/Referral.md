# Referral system integration

1. Get **operations** contract address.

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
      "type": "operations",
      "address": "TRuJzaPRarKRNYd7CjpMdQR5pSRG7fjdSP",
      "title": "Operations"
    },
    ...
  ]
}
```

2. Withdraw referral profit request.

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

const withdrawReferralProfit = async(to, amount) => {
  const withdrawAmount = amount * 10 ** 6;

  await operationsContract.withdrawReferralProfit(to, withdrawAmount)
    .send({ shouldPollResponse: true })
    .catch(processError);

  return true;
}

...

console.log(await withdrawReferralProfit('TSRb25AXQHaKbe51LLetgVS1NnpffzmCig', 15));

...
```
