"use client";
import { useUser } from "@/lib/store/user";
import { createSupabaseServerClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { ArchiveIcon, PersonIcon, ReaderIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavLinks() {
	const user = useUser((state) => state.user);
	const isAdmin = user?.role === "admin";

	const pathname = usePathname();
	const links = [
		{
			href: "/dashboard",
			Icon: ReaderIcon,
			text: "dashboard",
		},
		...(isAdmin ? [
		{
			href: "/dashboard/moderation",
			Icon: ArchiveIcon,
			text: "moderation",
		},
		// {
		// 	href: "/dashboard/user",
		// 	Icon: PersonIcon,
		// 	text: "users",
		// }
		] :[]),
	];

	return (
		<div className="flex items-center gap-5 border-b pb-2">
			{links.map(({ href, Icon, text }, index) => {
				return (
					<Link
						href={href}
						className={cn(
							"text-sm text-gray-400 flex  items-center gap-1 hover:underline transition-all",
							{ "text-green-500 underline": pathname === href }
						)}
						key={index}
					>
						<Icon /> / {text}
					</Link>
				);
			})}
		</div>
	);
}
