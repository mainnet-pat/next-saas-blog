"use client";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
	return (
		<Link href='/login'>
			<Button
				className="flex items-center gap-2"
				variant="outline"
			>
				<PersonIcon /> Login
			</Button>
		</Link>
	);
}
