import { ReplayPlayerMini } from "@/components/replay-player-mini";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/player")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center w-1/2">
			<ReplayPlayerMini autoPlay={true} />
		</div>
	);
}
