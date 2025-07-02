import { Button } from "@/components/ui/button";
import { loadPanelStorage } from "@/lib/webcams";
import { queryClient } from "@/main";
import { PlayIcon } from "@phosphor-icons/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const panelQueryOptions = queryOptions({
	queryKey: ["panel-one"],
	queryFn: loadPanelStorage,
});

export const Route = createFileRoute("/test")({
	component: RouteComponent,
	loader: () => queryClient.ensureQueryData(panelQueryOptions),
});

function RouteComponent() {
	const {
		data: { webcams, selectedCamera, videoEnabled },
	} = useSuspenseQuery(panelQueryOptions);
	return (
		<div>
			Webcams:{" "}
			{webcams?.map((webcam) => (
				<div key={webcam.deviceId}>{webcam.label}</div>
			))}
			<div>Default webcam: {selectedCamera?.label}</div>
			<div>Video enabled: {videoEnabled?.toString()}</div>
			<Button>
				<PlayIcon color="currentColor" className="fill-lime-500" />
			</Button>
		</div>
	);
}
