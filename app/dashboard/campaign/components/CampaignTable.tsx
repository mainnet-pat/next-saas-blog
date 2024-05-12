import React from "react";
import { EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ICampaign } from "@/lib/types";
import SwitchForm from "./SwitchForm";
import DeleteAlert from "./DeleteAlert";
import { readOwnCampaigns, readPremoderaionCampaigns, updateCampaignById } from "@/lib/actions/campaign";

export default async function CampaignTable({ kind = "own"} : {kind: "own" | "moderation"}) {
	const { data: campaigns } = kind === "own" ? await readOwnCampaigns() : await readPremoderaionCampaigns();
	const isModeration = kind === "moderation";

	return (
		<>
			<div className="rounded-md bg-graident-dark border-[0.5px] overflow-y-scroll ">
				<div className="w-[800px] md:w-full">
					<div className="grid grid-cols-5 border-b p-5 dark:text-gray-500">
						<h1 className=" col-span-2">Title</h1>
						<h1>Published</h1>
						<h1>Target</h1>
						<h1>Actions</h1>
					</div>
					<div className="space-y-10 p-5">
						{campaigns?.map((campaign, index) => {
							const updatePulished = updateCampaignById.bind(
								null,
								campaign.id,
								{
									is_published: !campaign.is_published,
								} as ICampaign
							);

							return (
								<div className="grid grid-cols-5" key={index}>
									<h1 className="dark:text-gray-200 col-span-2 font-lg font-medium">
										{campaign.title}
									</h1>

									<SwitchForm
										checked={campaign.is_published}
										onSubmit={updatePulished}
										name="publish"
										disabled={!isModeration}
									/>

									<h1 className="dark:text-gray-200 font-lg font-medium">
										${campaign.target_usd}
									</h1>

									<Actions canUpdate={!(campaign.is_published && !isModeration)} id={campaign.id} />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}

const Actions = ({ id, canUpdate }: { id: string, canUpdate: boolean }) => {
	return (
		<div className="flex items-center gap-2 flex-wrap">
			{/* TODO: change to id */}
			<Link href={`/campaign/${id}`}>
				<Button className="flex gap-2 items-center" variant="outline">
					<EyeOpenIcon />
					View
				</Button>
			</Link>
			<DeleteAlert disabled={!canUpdate} id={id} />

			<Link className={canUpdate ? "" : "pointer-events-none cursor-not-allowed"} href={`/dashboard/campaign/edit/${id}`}>
				<Button disabled={!canUpdate} className="flex gap-2 items-center" variant="outline">
					<Pencil1Icon />
					Edit
				</Button>
			</Link>
		</div>
	);
};
