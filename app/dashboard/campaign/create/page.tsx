"use client";
import React from "react";

import { toast } from "@/components/ui/use-toast";
import { defaultCreateCampaign } from "@/lib/data";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import CampaignForm from "../components/CampaignForm";
import { createCampaign } from "../../../../lib/actions/campaign";
import { CampaignFormSchemaType } from "../schema";
import { useRouter } from "next/navigation";

export default function CreateForm() {
	const router = useRouter();

	const onHandleSubmit = async (data: CampaignFormSchemaType) => {
		const result = JSON.parse(await createCampaign(data as any));

		const { error } = result as PostgrestSingleResponse<null>;
		if (error?.message) {
			toast({
				title: "Fail to create a post 😢",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{error.message}</code>
					</pre>
				),
			});
		} else {
			toast({
				title: "Successfully create a post 🎉",
				description: data.title,
			});
			router.push("/dashboard");
		}
	};

	return (
		<CampaignForm
			onHandleSubmit={onHandleSubmit}
			defaultCampaign={defaultCreateCampaign}
		/>
	);
}
