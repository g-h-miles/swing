import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "../components/forgot-password-form";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPassword,
});

function ForgotPassword() {
	return (
		<div className="p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<ForgotPasswordForm onBack={() => window.history.back()} />
		</div>
	);
}
