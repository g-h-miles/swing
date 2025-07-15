import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import reportWebVitals from "./reportWebVitals.ts";

import { scan } from "react-scan";
import { routeTree } from "./routeTree.gen";

scan({
	enabled: true,
});

export const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProvider.getContext(),
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			{/* <JotaiProvider store={atomStore}> */}
			<TanStackQueryProvider.Provider>
				<RouterProvider router={router} />
			</TanStackQueryProvider.Provider>
			{/* </JotaiProvider> */}
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
