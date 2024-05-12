import React from "react";
import CampaignTable from "../campaign/components/CampaignTable";

export default function Campaign() {
	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Campaigns for moderation</h1>
			</div>

			<CampaignTable kind="moderation" />
		</div>
	);
}
