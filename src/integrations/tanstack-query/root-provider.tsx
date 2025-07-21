import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { authClient } from "../../lib/auth-client";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
});
convexQueryClient.connect(queryClient);
export function getContext() {
	return {
		queryClient,
		convexClient: convex,
		convexQueryClient,
	};
}

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ConvexBetterAuthProvider>
	);
}
