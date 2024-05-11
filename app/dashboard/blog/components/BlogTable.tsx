import React from "react";
import { EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { IBlog } from "@/lib/types";
import SwitchForm from "./SwitchForm";
import DeleteAlert from "./DeleteAlert";
import { readOwnBlogs, readPremoderaionBlogs, updateBlogById } from "@/lib/actions/blog";

export default async function BlogTable({ kind = "own"} : {kind: "own" | "moderation"}) {
	const { data: blogs } = kind === "own" ? await readOwnBlogs() : await readPremoderaionBlogs();
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
						{blogs?.map((blog, index) => {
							const updatePulished = updateBlogById.bind(
								null,
								blog.id,
								{
									is_published: !blog.is_published,
								} as IBlog
							);

							return (
								<div className="grid grid-cols-5" key={index}>
									<h1 className="dark:text-gray-200 col-span-2 font-lg font-medium">
										{blog.title}
									</h1>

									<SwitchForm
										checked={blog.is_published}
										onSubmit={updatePulished}
										name="publish"
										disabled={!isModeration}
									/>

									<h1 className="dark:text-gray-200 font-lg font-medium">
										${blog.target_usd}
									</h1>

									<Actions canUpdate={!(blog.is_published && !isModeration)} id={blog.id} />
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
			<Link href={`/blog/${id}`}>
				<Button className="flex gap-2 items-center" variant="outline">
					<EyeOpenIcon />
					View
				</Button>
			</Link>
			<DeleteAlert disabled={!canUpdate} id={id} />

			<Link className={canUpdate ? "" : "pointer-events-none cursor-not-allowed"} href={`/dashboard/blog/edit/${id}`}>
				<Button disabled={!canUpdate} className="flex gap-2 items-center" variant="outline">
					<Pencil1Icon />
					Edit
				</Button>
			</Link>
		</div>
	);
};
