"use client";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import React from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
	const pathname = usePathname();
	const supabase = createClient();

	const handleLogin = () => {
		supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${location.origin}/callback?next=${pathname}`,
			},
		});
	};

	return (
		<Button
			className="flex items-center gap-2"
			variant="outline"
			onClick={handleLogin}
		>
			<GitHubLogoIcon /> Login
		</Button>
	);
}
