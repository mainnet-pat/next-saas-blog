export type ExplCurrency = {
  address: string,
  name: string,
  symbol: string,
  type: string,
  decimals: number,
}

export type ExplEvent = {
  chain: string,
  time: string,
  amountRaw: bigint,
  amount: number,
  amountUsd: number,
  currency: ExplCurrency,
}

export type ExplData = Record<string, {
  totalRaisedUsd: number,
  totalRaised: {[currencyName: string]: {
    amountRaw: bigint,
    amount: number,
    amountUsd: number,
    currency: ExplCurrency,
  }},
  allEvents: Array<ExplEvent>
}>;

export const parse3xplData = (responseArray: any[]) => {
  const result: ExplData = {};
  for (const address of responseArray) {
    const chain = address.data.chain;
    const totalRaised: Record<string, any> = {};
    let totalRaisedUsd = 0;
    const allEvents: any[] = [];
    for (const [, events] of Object.entries(address.data.events)) {
      for (const event of events as any) {
        if (event.effect.startsWith("+")) {
          const currency: string = event.currency;
          const amountRaw = BigInt(event.effect.slice(1));
          if (!totalRaised[currency]) {
            totalRaised[currency] = {
              amountRaw: 0n,
              amount: 0,
              amountUsd: 0,
              currency: address.library.currencies[currency]
            }
          }
          totalRaised[currency].amountRaw += amountRaw;

          const amount = Number(amountRaw * 10000n / BigInt(10 ** address.library.currencies[currency].decimals)) / 10000;
          totalRaised[currency].amount += amount;

          const amountUsd = amount * (address.library.rates[event.time]?.[event.currency].usd ?? 0);
          totalRaised[currency].amountUsd += amountUsd;

          totalRaisedUsd += amountUsd;

          allEvents.push({
            time: event.time,
            amount,
            amountRaw,
            amountUsd,
            chain,
            currency: {
              address: currency.split("/")[1] || currency,
              ...address.library.currencies[currency]
              }
          });
        }
      }
    }

    result[chain] = {
      totalRaisedUsd,
      totalRaised,
      allEvents,
    }
  }

  return result;
}
