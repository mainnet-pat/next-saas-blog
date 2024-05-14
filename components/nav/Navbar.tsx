"use client";
import React from "react";
import HoverUnderLine from "./HoverUnderLine";
import Link from "next/link";
import { useUser } from "@/lib/store/user";
import Profile from "./Profile";
import SignupNav from "./SignupNav";

export default function Navbar() {
	const user = useUser((state) => state.user);

	return (
		<nav className="w-full justify-between items-center flex p-5 xl:p-0">
			<HoverUnderLine>
				<Link href={"/"} className="font-bold text-2xl">
					Daily Media
				</Link>
			</HoverUnderLine>
			<div className="flex justify-content-between space-x-4">
				
				{user ? <Profile /> : <SignupNav />}
			</div>
		</nav>
	);
}
