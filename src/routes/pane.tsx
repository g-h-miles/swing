import { Pane, SplitPane } from "@rexxars/react-split-pane";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pane")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SplitPane
			split="vertical"
			minSize={50}
			maxSize={300}
			defaultSize={100}
			className="primary relative h-full w-full pb-24"
		>
			<div>min: 50px, max: 300px</div>
			<SplitPane split="horizontal">
				<div>default min: 50px</div>
				<div />
			</SplitPane>
		</SplitPane>
	);
}
