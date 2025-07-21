import { Link, createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInFormWithForgot } from "../components/sign-in-form";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/")({
	// beforeLoad: async (ctx) => {
	// 	const auth = await authClient.getSession();
	// 	console.log("auth", auth);
	// 	return {
	// 		auth,
	// 	};
	// },
	// loader: async (ctx) => {
	// 	const auth = ctx.context.auth;
	// 	return { auth };
	// },
	component: Index,
});

function Index() {
	// const loadedAuth = Route.useLoaderData().auth;
	const loggedInUser = useQuery(api.auth.loggedInUser);

	if (loggedInUser === undefined) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-blue-600 mb-4">VideoShare</h1>
					{/* <div>Loaded Auth:{loadedAuth.data?.user.email}</div> */}
					<Authenticated>
						<p className="text-xl text-gray-600 mb-6">
							Welcome back, {loggedInUser?.email ?? "friend"}!
						</p>

						{/* Navigation Links */}
						<div className="flex justify-center gap-4 mb-8">
							<Link
								to="/"
								className="px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
							>
								Browse Videos
							</Link>
							<Link
								to="/"
								className="px-6 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
							>
								Upload Video
							</Link>
							<Link
								to="/"
								className="px-6 py-2 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
							>
								My Videos
							</Link>
						</div>

						<div className="text-center">
							<p className="text-gray-600 mb-4">
								Choose an option above to get started!
							</p>
						</div>
					</Authenticated>

					<Unauthenticated>
						<p className="text-xl text-gray-600 mb-8">
							Sign in to upload and view videos
						</p>
						<div className="max-w-md mx-auto">
							<SignInFormWithForgot />
						</div>
					</Unauthenticated>
				</div>
			</div>
		</div>
	);
}
