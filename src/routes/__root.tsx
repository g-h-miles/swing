import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { DevTools } from "../integrations/dev-tools";
import "jotai-devtools/styles.css";

interface RouterContext {
	queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => {
		return (
			<>
				<Outlet />
				<DevTools />
			</>
		);
	},
});
