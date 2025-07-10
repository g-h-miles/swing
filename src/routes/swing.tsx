//swing.tsx route
import { Header } from "@/components/header";
import { ReplayScroll } from "@/components/replay-virtual_";
import { ResizableDemo } from "@/components/swing";
import { useWebcamStore } from "@/lib/stores/webcam-store";
import { getAvailableWebcams } from "@/lib/webcams";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/swing")({
	loader: async () => {
		const availableWebcams = await getAvailableWebcams();
		return {
			availableWebcams,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { availableWebcams } = Route.useLoaderData();
	const initializeFromLoader = useWebcamStore(
		(state) => state.initializeFromLoader,
	);

	useEffect(() => {
		initializeFromLoader(availableWebcams);
	}, [availableWebcams, initializeFromLoader]);

	return (
		<div className="flex w-full h-screen fancy-background">
			<div className="w-full h-full flex flex-col max-w-[2000px] mx-auto">
				<Header />

				<div className="flex flex-1 min-h-0 overflow-hidden px-4 pb-4 gap-3">
					<ResizableDemo className="flex-shrink-0" />
					<ReplayScroll className="flex-1 hidden md:block" />
				</div>
			</div>
		</div>
	);
}
