"use client";
import { useEffect, useState } from "react";
import { BlogContentLoading } from "./Skeleton";
import { ExplData, ExplEvent, parse3xplData } from "./3xpl";
import { IBlog } from "@/lib/types";
import moment from "moment";
import { Switch } from "@/components/ui/switch";
import { RocketIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import AddressAlert from "./AddressAlert";

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

const filterEvents = (events: ExplEvent[], showZeroBalances: boolean = false): ExplEvent[] => {
  return showZeroBalances ? events : events.filter(({ amountUsd }) => amountUsd > 0);
}

export default function Content({ addresses, blog }: { addresses: any, blog: IBlog }) {
	const [loading, setLoading] = useState(true);
  const [totalRaisedUsd, setTotalRaisedUsd] = useState(0);
  const [rawData, setRawData] = useState<ExplData>({});
  const [filteredData, setFilteredData] = useState<ExplData>({});
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const [showPlainHistory, setShowPlainHistory] = useState(true);
  const [rawEvents, setRawEvents] = useState<ExplEvent[]>([]);
  const [mergedEvents, setMergedEvents] = useState<ExplEvent[]>([]);

	useEffect(() => {
    (async () => {
      const result = await Promise.all(Object.entries(addresses).map(async ([chain, address]: any) => {
        const response = await fetch(`https://api.3xpl.com/${chain}/address/${address}?data=address,balances,events&from=all&library=currencies,rates(usd)&limit=1000&token=3A0_t3st3xplor3rpub11cb3t4efcd21748a5e`);
        const data = await response.json();
        data.data.chain = chain;
        return data;
      }));

      let merged: ExplEvent[] = [];

      const parsedData = parse3xplData(result);
      for (const { totalRaisedUsd, allEvents } of Object.values(parsedData)) {
        setTotalRaisedUsd((prev) => prev + totalRaisedUsd);
        merged = [...merged, ...allEvents];
      }

      setRawData(parsedData);
      setFilteredData(filterData(parsedData, showZeroBalances));

      merged.sort((a, b) => b.time.localeCompare(a.time));
      setRawEvents(merged);
      setMergedEvents(filterEvents(merged, showZeroBalances));

      setLoading(false);
    })();

		// eslint-disable-next-line
	}, []);

  useEffect(() => {
    setFilteredData(filterData(rawData, showZeroBalances));
    setMergedEvents(filterEvents(rawEvents, showZeroBalances));
  }, [showZeroBalances, rawData]);

  const showPopup = (chain: string, address: string) => {

  };

	if (loading) {
		return <BlogContentLoading />;
	}

	return (
    <div>
      <div>User is raising funds on following blockcains (click to view address):</div>
      <div className="flex flex-wrap gap-5 justify-center">
        { Object.entries(addresses).map(([chain, address]: any) => (
          <div key={chain}>
            <AddressAlert chain={chain} address={address} />
          </div>
        ))}
      </div>
      <div>Total raised ${totalRaisedUsd} of ${blog.target_usd}</div>
      <Progress value={totalRaisedUsd/blog.target_usd*100} max={blog.target_usd} />
      <div className="flex justify-between gap-1 border p-2 rounded-md">
        <div className="flex items-center">History</div>
        <div className="flex justify-end">
          <div className="flex items-center gap-1 p-2">
            <RocketIcon />

            <span className="text-sm">
              Show Plain History
            </span>
            <Switch
              checked={showPlainHistory}
              onCheckedChange={() => setShowPlainHistory(!showPlainHistory)}
            />
          </div>
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
      </div>

      {!showPlainHistory ? (
        Object.entries(filteredData).sort((a,b) => a[0].localeCompare(b[0])).map(([chain, data]) => {
          return data.allEvents.length > 0 && (
            <div key={chain} className="mt-3">
              <div className="flex items-center gap-2">
                <Image src={`https://3xpl.com/3xpl-assets/${chain}/logo_dark.svg`} alt={chain} title={chain} width={24} height={24} />
                {chain}
              </div>
              { data.allEvents.map((event,index) =>
                (
                  <div key={`${chain}-${index}`}>{moment(event.time).fromNow()} - {event.amount} { event.currency.symbol } {`($${event.amountUsd.toFixed(2)})`}</div>
                ))
              }
            </div>
          );
        })
      ) : (
        mergedEvents.map((event, index) => {
          return (
            <div key={`event-${index}`} className="mt-1">
              <div className="flex items-center gap-2">
                <Image src={`https://3xpl.com/3xpl-assets/${event.chain}/logo_dark.svg`} alt={event.chain} title={event.chain} width={24} height={24} />
                <div>{moment(event.time).fromNow()} - {event.amount} { event.currency.symbol } {`($${event.amountUsd.toFixed(2)})`}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
