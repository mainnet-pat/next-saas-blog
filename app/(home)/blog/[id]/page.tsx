import Image from "next/image";
import React from "react";
import Content from "./components/Content";
import { readBlogById } from "@/lib/actions";
import { redirect } from "next/navigation";

// TODO: static generate

export default async function page({ params }: { params: { id: string } }) {
	const { data: blog } = await readBlogById(params.id);

	if (!blog) {
		return redirect("/");
	}

	return (
		<div className="max-w-5xl mx-auto min-h-screen  pt-10 space-y-10">
			<div className="sm:px-10 space-y-5">
				<h1 className=" text-3xl font-bold dark:text-gray-200">
					{blog?.title}
				</h1>
				<p className="text-sm dark:text-gray-400">
					{new Date(blog?.created_at!).toDateString()}
				</p>
			</div>

			<div className="w-full h-96 relative">
				<Image
					src={blog?.image_url!}
					alt="cover"
					fill
					className=" object-cover object-center rounded-md border-[0.5px] border-zinc-600"
				/>
			</div>
			<Content blogId={params.id} />
		</div>
	);
}