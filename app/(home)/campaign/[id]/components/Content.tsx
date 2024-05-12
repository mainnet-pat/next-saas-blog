"use client";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import { Database } from "@/lib/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import React, { useEffect, useState, useTransition } from "react";
import { CampaignContentLoading } from "./Skeleton";

export default function Content({ campaignId }: { campaignId: string }) {
	const [loading, setLoading] = useState(true);

	const [campaign, setCampaign] = useState<{
		campaign_id: string;
		content: string;
		created_at: string;
	} | null>();

	const supabase = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const readCampaignContent = async () => {
		const { data } = await supabase
			.from("campaign_content")
			.select("*")
			.eq("campaign_id", campaignId)
			.single();
		setCampaign(data);
		setLoading(false);
	};

	useEffect(() => {
		readCampaignContent();

		// eslint-disable-next-line
	}, []);

	if (loading) {
		return <CampaignContentLoading />;
	}

	return <MarkdownPreview content={campaign?.content || ""} />;
}
