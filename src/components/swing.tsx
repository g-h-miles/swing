//swing.tsx component
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useWindowSize } from "@uidotdev/usehooks";
import { useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

// import { useMeasure } from "@uidotdev/usehooks";

import { WebcamPanelContent } from "./webcam-panel";

export function ResizableDemo({
	className,
	availableWebcams,
}: { className?: string; availableWebcams: MediaDeviceInfo[] }) {
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	// const isSmallDevice = false;
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
				<WebcamPanelContent
					panelId="panel-one"
					availableWebcams={availableWebcams}
				/>
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
						<WebcamPanelContent
							panelId="panel-two"
							availableWebcams={availableWebcams}
						/>
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
						id="panel-three"
						collapsible
						// onCollapse={() => {}}
						// onExpand={() => {}}
					>
						<WebcamPanelContent
							panelId="panel-three"
							availableWebcams={availableWebcams}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
