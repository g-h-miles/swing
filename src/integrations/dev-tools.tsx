import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DevTools as JotaiDevTools } from "jotai-devtools";
import TanStackQueryLayout from "../integrations/tanstack-query/layout";

export const DevTools = () => {
	return (
		<>
			<TanStackRouterDevtools position="bottom-left" />

			<div className="!size-4">
				<style>
					{`
											.jotai-devtools-trigger-button {
												width: 3rem !important;
												height: 3rem !important;
                        z-index: 1000;
											}
										`}
				</style>
				<JotaiDevTools position="bottom-right" />
			</div>
			<TanStackQueryLayout />
		</>
	);
};
