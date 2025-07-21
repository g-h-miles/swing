import { useAuthActions } from "@convex-dev/auth/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const { signIn } = useAuthActions();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!email.trim()) {
			toast.error("Please enter your email address");
			return;
		}

		setIsLoading(true);
		try {
			await signIn("password", {
				email: email.trim(),
				flow: "reset",
			});
			setEmailSent(true);
			toast.success("Password reset email sent! Check your inbox.");
		} catch (error) {
			console.error("Password reset error:", error);
			toast.error("Failed to send reset email. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (emailSent) {
		return (
			<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
				<div className="text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
						<svg
							className="w-8 h-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Checkmark</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Check Your Email
					</h2>
					<p className="text-gray-600 mb-6">
						We've sent a password reset link to <strong>{email}</strong>
					</p>
					<p className="text-sm text-gray-500 mb-6">
						Didn't receive the email? Check your spam folder or try again.
					</p>
					<Link
						to="/"
						className="inline-block w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
					>
						Back to Sign In
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
			<div className="text-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Reset Password
				</h2>
				<p className="text-gray-600">
					Enter your email address and we'll send you a link to reset your
					password.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Email Address
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="auth-input-field"
						placeholder="Enter your email"
						required
						disabled={isLoading}
					/>
				</div>

				<button type="submit" disabled={isLoading} className="auth-button">
					{isLoading ? "Sending..." : "Send Reset Link"}
				</button>
			</form>

			<div className="mt-6 text-center">
				<Link
					to="/"
					className="text-blue-600 hover:text-blue-800 text-sm font-medium"
				>
					Back to Sign In
				</Link>
			</div>
		</div>
	);
}
