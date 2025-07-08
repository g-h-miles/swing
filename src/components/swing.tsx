//swing.tsx component
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useCallback, useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

import { WebcamPanelContent } from "./webcam-panel";

const LAYOUT_KEY = "cam-layout";
const SUB_LAYOUT_KEY = "cam-layout-right";

export function ResizableDemo({ className }: { className?: string }) {
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

	const panelOne = useRef<ImperativePanelHandle | null>(null);
	const panelTwoThree = useRef<ImperativePanelHandle | null>(null);
	const panelTwo = useRef<ImperativePanelHandle | null>(null);
	const panelThree = useRef<ImperativePanelHandle | null>(null);

	const handlePanelResize = useCallback(
		({ ref }: { ref: React.RefObject<ImperativePanelHandle | null> }) => {
			const panel = ref.current;
			if (!panel) {
				return;
			}
			const size = panel.getSize();
			const isCollapsed = panel.isCollapsed();
			if (size < 10 && !isCollapsed) {
				panel.collapse();
			} else if (size > 90 && size < 100) {
				panel.resize(100);
			}
			return;
		},
		[],
	);

	const handleHandleDoubleClick = useCallback(
		({ ref }: { ref: React.RefObject<ImperativePanelHandle | null> }) => {
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
		},
		[],
	);

	return (
		<ResizablePanelGroup
			autoSaveId={LAYOUT_KEY}
			direction="horizontal"
			className={cn(
				"w-full  md:max-w-[min(80%,_2000px)]   rounded-xs ",
				"md:min-w-[450px] h-full",
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
				<WebcamPanelContent panelId="panel-one" />
			</ResizablePanel>
			{
				<ResizableHandle
					className={cn("w-0", "bg-transparent", isSmallDevice && "hidden")}
					onDoubleClick={() => handleHandleDoubleClick({ ref: panelOne })}
					hitAreaMargins={{ coarse: 5, fine: 15 }}
					withHandle
				>
					<div />
				</ResizableHandle>
			}

			<ResizablePanel
				defaultSize={50}
				ref={panelTwoThree}
				collapsible
				className={cn(isSmallDevice && "hidden")}
			>
				<ResizablePanelGroup
					direction="vertical"
					autoSaveId={SUB_LAYOUT_KEY}
					className="overflow-visible"
				>
					<ResizablePanel
						defaultSize={50}
						ref={panelTwo}
						id="panel-two"
						collapsible
						onResize={() => {
							handlePanelResize({ ref: panelTwo });
						}}
					>
						<WebcamPanelContent className="" panelId="panel-two" />
					</ResizablePanel>
					<ResizableHandle
						className={cn(
							"bg-transparent",
							"[&[data-panel-group-direction='vertical']]:h-0",
						)}
						hitAreaMargins={{ coarse: 5, fine: 15 }}
						withHandle
						onDoubleClick={() => handleHandleDoubleClick({ ref: panelTwo })}
					></ResizableHandle>
					<ResizablePanel
						defaultSize={50}
						ref={panelThree}
						id="panel-three"
						collapsible
					>
						<WebcamPanelContent panelId="panel-three" />
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
