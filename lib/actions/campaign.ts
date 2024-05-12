"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { ICampaign } from "@/lib/types";
import { revalidatePath, unstable_noStore } from "next/cache";
import { CampaignFormSchemaType } from "../../app/dashboard/campaign/schema";

const DASHBOARD = "/dashboard/campaign";

export async function createCampaign(data: {
	content: string;
	title: string;
	image_url: string;
	is_premium: boolean;
	is_published: boolean;
	addresses: Record<string, string>;
	target_usd: number;
	user_id: string;
}) {
	const { ["content"]: excludedKey, ...campaign } = data;

	const supabase = await createSupabaseServerClient();
	const campaignResult = await supabase
		.from("campaign")
		.insert(campaign)
		.select("id")
		.single();

	if (campaignResult.error?.message && !campaignResult.data) {
		return JSON.stringify(campaignResult);
	} else {
		const result = await supabase
			.from("campaign_content")
			.insert({ campaign_id: campaignResult?.data?.id!, content: data.content, user_id: data.user_id });

		revalidatePath(DASHBOARD);
		return JSON.stringify(result);
	}
}

export async function readCampaign() {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("campaign")
		.select("*")
		.eq("is_published", true)
		.order("created_at", { ascending: true });
}

export async function readCampaignAdmin() {
	// await new Promise((resolve) => setTimeout(resolve, 2000));

	const supabase = await createSupabaseServerClient();
	return supabase
		.from("campaign")
		.select("*")
		.order("created_at", { ascending: true });
}

export async function readOwnCampaigns() {
	const supabase = await createSupabaseServerClient();
	const user_id = (await supabase.auth.getSession()).data?.session?.user.id;
	if (!user_id) {
		return {data: []};
	}
	return supabase
		.from("campaign")
		.select("*")
		.eq("user_id", user_id)
		.order("created_at", { ascending: true });
}

export async function readPremoderaionCampaigns() {
	const supabase = await createSupabaseServerClient();
	const user_id = (await supabase.auth.getSession()).data?.session?.user.id;
	if (!user_id) {
		return {data: []};
	}
	return supabase
		.from("campaign")
		.select("*")
		.neq("user_id", user_id)
		.eq("is_published", false)
		.order("created_at", { ascending: true });
}

export async function readCampaignById(campaignId: string) {
	const supabase = await createSupabaseServerClient();
	return supabase.from("campaign").select("*").eq("id", campaignId).single();
}
export async function readCampaignIds() {
	const supabase = await createSupabaseServerClient();
	return supabase.from("campaign").select("id");
}

export async function readCampaignDetailById(campaignId: string) {
	const supabase = await createSupabaseServerClient();
	return await supabase
		.from("campaign")
		.select("*,campaign_content(*)")
		.eq("id", campaignId)
		.single();
}

export async function readCampaignContent(campaignId: string) {
	unstable_noStore();
	const supabase = await createSupabaseServerClient();
	return await supabase
		.from("campaign_content")
		.select("content")
		.eq("campaign_id", campaignId)
		.single();
}

export async function updateCampaignById(campaignId: string, data: ICampaign) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("campaign").update(data).eq("id", campaignId);
	revalidatePath(DASHBOARD);
	revalidatePath("/campaign/" + campaignId);
	return JSON.stringify(result);
}

export async function updateCampaignDetail(
	campaignId: string,
	data: CampaignFormSchemaType
) {
	const { ["content"]: excludedKey, ...campaign } = data;

	const supabase = await createSupabaseServerClient();
	const resultCampaign = await supabase
		.from("campaign")
		.update(campaign)
		.eq("id", campaignId);
	if (resultCampaign.error) {
		return JSON.stringify(resultCampaign);
	} else {
		const result = await supabase
			.from("campaign_content")
			.update({ content: data.content })
			.eq("campaign_id", campaignId);
		revalidatePath(DASHBOARD);
		revalidatePath("/campaign/" + campaignId);

		return JSON.stringify(result);
	}
}

export async function deleteCampaignById(campaignId: string) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("campaign").delete().eq("id", campaignId);
	revalidatePath(DASHBOARD);
	revalidatePath("/campaign/" + campaignId);
	return JSON.stringify(result);
}
