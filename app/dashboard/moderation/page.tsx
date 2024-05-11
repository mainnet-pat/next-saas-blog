import React from "react";
import BlogTable from "../blog/components/BlogTable";

export default function Blog() {
	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Blogs for moderation</h1>
			</div>

			<BlogTable kind="moderation" />
		</div>
	);
}
