"use client";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { defineCustomElements } from '@bitjson/qr-code';
import { useEffect } from "react";

export default function AddressAlert({ chain, address }: { chain: string, address: boolean}) {
	useEffect(() => {defineCustomElements(window)}, [])

	const chainName = chain.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()).replace(' ', '');
	const renderAddress = chain === "bitcoin-cash" ? `bitcoincash:${address}` : address;

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button>
					<div className="flex items-center flex-col gap-2 cursor-pointer">
						<div>
							<Image src={`https://3xpl.com/3xpl-assets/${chain}/logo_dark.svg`} alt={chain} title={chain} width={64} height={64} />
						</div>
						<div>
							{chainName}
						</div>
					</div>
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{`${chainName} Address`}
					</AlertDialogTitle>
				</AlertDialogHeader>
					<div className="flex items-center justify-center flex-col gap-4">
						{ /* @ts-expect-error */ }
						<qr-code
							contents={address as any}
							module-color="#13532d"
							position-ring-color="#13532d"
							position-center-color="#13532d"
							style={{ width: "260px", height: "260px", margin: "5px auto 0 auto", backgroundColor: "#fff" }}>
								<Image src={`https://3xpl.com/3xpl-assets/${chain}/logo_dark.svg`} alt={chain} title={chain} width={96} height={96} slot="icon" />
						</qr-code>
						<div>{renderAddress}</div>
					</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Close</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
