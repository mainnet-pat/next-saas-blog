"use client";
import React from "react";

import { toast } from "@/components/ui/use-toast";

import CampaignForm from "../../../components/CampaignForm";
import { ICampaignDetial } from "@/lib/types";
import { CampaignFormSchemaType } from "../../../schema";
import { updateCampaignDetail } from "../../../../../../lib/actions/campaign";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { redirect, useRouter } from "next/navigation";

export default function EditForm({ campaign }: { campaign: ICampaignDetial }) {
	const router = useRouter();

	const onHandleSubmit = async (data: CampaignFormSchemaType) => {
		const result = JSON.parse(
			await updateCampaignDetail(campaign?.id!, data)
		) as PostgrestSingleResponse<null>;
		if (result.error) {
			toast({
				title: "Fail to update ",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
							{result.error?.message}
						</code>
					</pre>
				),
			});
		} else {
			toast({
				title: "Successfully update 🎉",
			});
			router.push("/dashboard");
		}
	};

	return <CampaignForm onHandleSubmit={onHandleSubmit} defaultCampaign={campaign} />;
}
