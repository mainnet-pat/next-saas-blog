import Link from "next/link";
import React from "react";

import { PiTelegramLogo } from "react-icons/pi";
export default function Footer() {
	return (
		<footer className=" border-t py-10">
			<div className="max-w-7xl py-10 px-5 md:p-0 space-y-5  mx-auto flex justify-between md:items-end flex-col md:flex-row">
				<div className="space-y-10">
					<div className="space-y-2 w-full sm:w-96">
						<h1 className="text-3xl font-bold">Roger Web</h1>
						<p className="">
							Crowdfunding platform for developers and creators
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Link href="https://t.me/arbius_ai" target="blank">
							<PiTelegramLogo className="w-5 h-5" />
						</Link>
					</div>
				</div>

				<h1 className="text-sm">
					&copy; 2024 Arbius. All rights reserved
				</h1>
			</div>
		</footer>
	);
}
