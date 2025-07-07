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

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

function RouteComponent() {
	return (
		<ResizablePanelGroup
			direction="horizontal"
			className="max-w-xl rounded-lg border md:min-w-[900px]"
		>
			<ResizablePanel defaultSize={50}>
				<div className="flex h-[600px] items-center justify-center p-6">
					<span className="font-semibold">One</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle className="w-8 bg-amber-200" />
			<ResizablePanel defaultSize={50}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={25}>
						<div className="flex h-full items-center justify-center p-6">
							<span className="font-semibold">Two</span>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle className="h-8 bg-amber-200" />
					<ResizablePanel defaultSize={75}>
						<div className="flex h-full items-center justify-center p-6">
							<span className="font-semibold">Three</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
