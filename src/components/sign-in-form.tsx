"use client";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";

export function SignInFormWithForgot() {
	// const { signIn } = useAuthActions();
	const signIn = authClient.signIn.email;
	const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
	const [submitting, setSubmitting] = useState(false);

	return (
		<div className="w-full">
			<form
				className="flex flex-col gap-4"
				onSubmit={async (e) => {
					e.preventDefault();
					setSubmitting(true);
					const formData = new FormData(e.target as HTMLFormElement);
					formData.set("flow", flow);
					try {
						await signIn({
							email: formData.get("email") as string,
							password: formData.get("password") as string,
						});
					} catch (error) {
						let toastTitle = "";
						if (error instanceof Error) {
							if (error.message.includes("Invalid email")) {
								toastTitle = "Invalid email. Please try again.";
							} else if (error.message.includes("Invalid password")) {
								toastTitle = "Invalid password. Please try again.";
							} else {
								toastTitle =
									flow === "signIn"
										? "Could not sign in, did you mean to sign up?"
										: "Could not sign up, did you mean to sign in?";
							}
							toast.error(toastTitle);
							setSubmitting(false);
						}
						toast.error(toastTitle);
						setSubmitting(false);
					}
				}}
			>
				<input
					className="auth-input-field"
					type="email"
					name="email"
					placeholder="Email"
					required
				/>
				<input
					className="auth-input-field"
					type="password"
					name="password"
					placeholder="Password"
					required
				/>
				<button className="auth-button" type="submit" disabled={submitting}>
					{flow === "signIn" ? "Sign in" : "Sign up"}
				</button>

				{flow === "signIn" && (
					<div className="text-center">
						<Link
							to="/forgot-password"
							className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
				)}

				<div className="text-center text-sm text-gray-600">
					<span>
						{flow === "signIn"
							? "Don't have an account? "
							: "Already have an account? "}
					</span>
					<button
						type="button"
						className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
						onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
					>
						{flow === "signIn" ? "Sign up instead" : "Sign in instead"}
					</button>
				</div>
			</form>
			<div className="flex items-center justify-center my-3">
				<hr className="my-4 grow border-gray-200" />
				<span className="mx-4 text-gray-600">or</span>
				<hr className="my-4 grow border-gray-200" />
			</div>
		</div>
	);
}
