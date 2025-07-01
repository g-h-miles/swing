//swing.tsx route
import { Header } from "@/components/header";
import { ReplayScroll } from "@/components/replay-scroll";
import { ResizableDemo } from "@/components/swing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/swing")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex w-full h-screen fancy-background">
			<div className="w-full h-full flex flex-col">
				<Header />

				<div className="flex flex-1 min-h-0 overflow-hidden px-4 pb-4 gap-3">
					<ResizableDemo className="flex-shrink-0" />
					<ReplayScroll className="flex-1 hidden md:block" />
				</div>
			</div>
		</div>
	);
}
