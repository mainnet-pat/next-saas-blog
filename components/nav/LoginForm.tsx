"use client";
import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

export default function LoginForm() {
	return (
		<Link href='/auth/login'>
			<Button
				className="flex items-center gap-2"
				variant="outline"
			>
				<PersonIcon /> Login
			</Button>
		</Link>
	);
}
