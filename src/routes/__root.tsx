import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

interface RouterContext {
	queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => {
		return (
			<>
				<Outlet />

				<TanStackRouterDevtools position="bottom-left" />
				<TanStackQueryLayout />
			</>
		);
	},
});
