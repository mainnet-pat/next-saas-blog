import React from "react";
import CampaignTable from "./campaign/components/CampaignTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";

export default function Campaign() {
	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Campaigns</h1>
				<Link href="/dashboard/campaign/create">
					<Button
						className="flex items-center gap-2 "
						variant="outline"
					>
						Create <PlusIcon />
					</Button>
				</Link>
			</div>

			<CampaignTable kind="own"/>
		</div>
	);
}
