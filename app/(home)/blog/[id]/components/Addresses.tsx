"use client";
import { useEffect, useState } from "react";
import { BlogContentLoading } from "./Skeleton";
import { ExplData, parse3xplData } from "./3xpl";
import { IBlog } from "@/lib/types";
import moment from "moment";
import { Switch } from "@/components/ui/switch";
import { RocketIcon } from "@radix-ui/react-icons";

const filterData = (data: ExplData, showZeroBalances: boolean = false): ExplData => {
  return Object.fromEntries(Object.entries(data).map(([chain, { totalRaised, allEvents }]) => {
    return [
      chain,
      {
        totalRaised,
        allEvents: showZeroBalances ? allEvents : allEvents.filter(({ amountUsd }) => amountUsd > 0),
      }
    ];
  })) as ExplData;
}

export default function Content({ addresses, blog }: { addresses: any, blog: IBlog }) {
	const [loading, setLoading] = useState(true);
  const [totalRaisedUsd, setTotalRaisedUsd] = useState(0);
  const [rawData, setRawData] = useState<ExplData>({});
  const [filteredData, setFilteredData] = useState<ExplData>({});
  const [showZeroBalances, setShowZeroBalances] = useState(false);

	useEffect(() => {
    (async () => {
      const result = await Promise.all(Object.entries(addresses).map(async ([chain, address]: any) => {
        const response = await fetch(`https://api.3xpl.com/${chain}/address/${address}?data=address,balances,events&from=all&library=currencies,rates(usd)&limit=1000&token=3A0_t3st3xplor3rpub11cb3t4efcd21748a5e`);
        const data = await response.json();
        data.data.chain = chain;
        return data;
      }));

      const parsedData = parse3xplData(result);
      for (const { totalRaisedUsd } of Object.values(parsedData)) {
        setTotalRaisedUsd((prev) => prev + totalRaisedUsd);
      }

      setRawData(parsedData);
      setFilteredData(filterData(parsedData, showZeroBalances));

      setLoading(false);
    })();

		// eslint-disable-next-line
	}, []);

  useEffect(() => {
    setFilteredData(filterData(rawData, showZeroBalances));
  }, [showZeroBalances, rawData]);

	if (loading) {
		return <BlogContentLoading />;
	}

	return (
    <div>
      <div>User is raising funds on following blockcains:</div>
      { Object.entries(addresses).map(([chain, address]: any) => chain).join(", ")}
      <div>Total raised ${totalRaisedUsd} of ${blog.target_usd}</div>
      {/* { JSON.stringify(addresses) } */}
      <div className="flex justify-between gap-1 border p-2 rounded-md">
        <div className="flex items-center">History</div>
        <div className="flex items-center gap-1 p-2">
          <RocketIcon />

          <span className="text-sm">
            Show Unknown Tokens
          </span>
          <Switch
            checked={showZeroBalances}
            onCheckedChange={() => setShowZeroBalances(!showZeroBalances)}
          />
        </div>
      </div>
      { Object.entries(filteredData).map(([chain, data]) => {
        return (
          <div key={chain} className="mt-3">
            <div>{chain}</div>
            { data.allEvents.map((event) =>
              (<>
                <div>{moment(event.time).fromNow()} - {event.amount} { event.currency.symbol } {`($${event.amountUsd.toFixed(2)})`}</div>
              </>))
            }
          </div>
        );
      }) }
    </div>
  );
}
