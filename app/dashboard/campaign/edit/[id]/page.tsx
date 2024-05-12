import React from "react";
import EditForm from "./components/EditForm";
import { ICampaignDetial } from "@/lib/types";
import { readCampaignDetailById } from "@/lib/actions/campaign";

export default async function Edit({ params }: { params: { id: string } }) {
	const { data: campaign } = await readCampaignDetailById(params.id);
	return <EditForm campaign={campaign as ICampaignDetial} />;
}
