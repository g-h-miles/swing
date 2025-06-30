import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Fragment, useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
// import { useMeasure } from "@uidotdev/usehooks";

import { WebcamPanelContent } from "./webcam-panel";

// import { WebcamPlayer } from "@/components/window-player";

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export const Plain = () => {
	return (
		<div className="flex w-full h-screen fancy-background">
			<div className="w-full h-full flex flex-col">
				<Header />

				<div className="flex flex-1 min-h-0 overflow-hidden px-4 pb-4 gap-3">
					<ResizableDemo className="flex-shrink-0" />
					<ScrollAreaDemo className="flex-1 hidden md:block" />
				</div>
			</div>
		</div>
	);
};

export function Header() {
	return (
		<div className="w-full h-16 md:h-20 flex-shrink-0 px-4 pt-4 pb-2">
			<img src="/loft2.svg" alt="logo" className="h-full" />
		</div>
	);
}

export function ResizableDemo({ className }: { className?: string }) {
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	// const [ref, { width, height }] = useMeasure();

	const panelOne = useRef<ImperativePanelHandle | null>(null);
	const panelTwoThree = useRef<ImperativePanelHandle | null>(null);
	const panelTwo = useRef<ImperativePanelHandle | null>(null);
	const panelThree = useRef<ImperativePanelHandle | null>(null);

	const handlePanelResize = ({
		ref,
	}: { ref: React.RefObject<ImperativePanelHandle | null> }) => {
		const panel = ref.current;
		if (!panel) {
			return;
		}
		const size = panel.getSize();
		if (size < 10) {
			panel.collapse();
		} else if (size > 90) {
			panel.resize(100);
		}
		return;
	};

	const handleHandleDoubleClick = ({
		ref,
	}: { ref: React.RefObject<ImperativePanelHandle | null> }) => {
		const panel = ref.current;
		if (!panel) {
			return;
		}
		const currentSize = panel.getSize();
		if (currentSize === 0 || currentSize === 100) {
			panel.resize(50);
		} else if (currentSize < 50) {
			panel.collapse();
		} else {
			panel.resize(100);
		}
		return;
	};

	// const [panelOneMeasureRef, panelOneMeasure] = useMeasure();

	return (
		<ResizablePanelGroup
			autoSaveId={"cam-layout"}
			direction="horizontal"
			className={cn(
				"w-full  md:max-w-[min(80%,_2000px)]   rounded-xs border border-border md:min-w-[450px] h-full",
				className,
			)}
		>
			<ResizablePanel
				ref={panelOne}
				id="panel-one"
				tagName="div"
				defaultSize={50}
				collapsible
				className={cn("relative", className)}
				onResize={() => {
					handlePanelResize({ ref: panelOne });
				}}
			>
				<WebcamPanelContent />
			</ResizablePanel>
			<ResizableHandle
				className={cn("w-8", "bg-transparent", isSmallDevice && "hidden")}
				withHandle
				onDoubleClick={() => handleHandleDoubleClick({ ref: panelOne })}
			>
				<div />
			</ResizableHandle>

			<ResizablePanel
				defaultSize={50}
				ref={panelTwoThree}
				collapsible
				className={cn(isSmallDevice && "hidden")}
			>
				<ResizablePanelGroup direction="vertical" autoSaveId="cam-layout-right">
					{/* <WebcamPanel /> */}
					<ResizablePanel
						defaultSize={50}
						ref={panelTwo}
						id="panel-two"
						collapsible
						onResize={() => {
							handlePanelResize({ ref: panelTwo });
						}}
						// onCollapse={() => {}}
						// onExpand={() => {}}
					>
						<WebcamPanelContent />
					</ResizablePanel>
					<ResizableHandle
						className={
							"bg-transparent h-8 [&[data-panel-group-direction='vertical']]:h-8"
						}
						withHandle
						onDoubleClick={() => handleHandleDoubleClick({ ref: panelTwo })}
					>
						<div />
					</ResizableHandle>
					<ResizablePanel
						defaultSize={50}
						ref={panelThree}
						collapsible
						// onCollapse={() => {}}
						// onExpand={() => {}}
					>
						<WebcamPanelContent />
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export function ScrollAreaDemo({ className }: { className?: string }) {
	return (
		<ScrollArea className={cn("rounded-xs border m-0", className)}>
			<div className="p-1">
				{tags.map((tag) => (
					<Fragment key={tag}>
						<div className="text-sm h-32 rounded-md border border-lime-400">
							<span className="text-xs bg-muted text-muted-foreground ml-1">
								{tag}
							</span>
						</div>
						<Separator className="my-2" />
					</Fragment>
				))}
			</div>
		</ScrollArea>
	);
}
