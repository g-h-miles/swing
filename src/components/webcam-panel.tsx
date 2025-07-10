//webcam-panel.tsx component
import { glassStyles } from "@/glass";
import { useWebcamStore } from "@/lib/stores/webcam-store";
import { cn } from "@/lib/utils";
import { Webcam } from "./ui/webcam";
import { WebcamDropdown } from "./webcam-dropdown_";
import { WebcamStatusText } from "./webcam-status-description";

export const WebcamPanelContent = ({
	panelId,
	className,
}: {
	panelId: string;
	className?: string;
}) => {
	const selection = useWebcamStore((state) => state.selections[panelId]);

	return (
		<div className="p-1 size-full @container">
			<div
				className={cn(
					"relative h-full w-full",
					!selection?.videoEnabled && "border border-border rounded-md",
					className,
				)}
			>
				<div className="absolute top-2 left-2 z-10">
					{
						<WebcamStatusText
							status={
								!selection?.deviceId
									? "inactive"
									: selection?.videoEnabled
										? "live"
										: "ready"
							}
						/>
					}
				</div>
				<div className="absolute top-2 right-2 z-10">
					<WebcamDropdown panelId={panelId} />
				</div>
				{selection?.videoEnabled && selection?.deviceId && (
					<div className="bg-red-200 relative w-full h-full flex items-center justify-center overflow-hidden">
						<Webcam
							mirrored={true}
							audio={true}
							muted={true}
							videoConstraints={{
								deviceId: selection?.deviceId,
							}}
							className={cn(
								"w-full h-full object-cover",
								"bg-black",
								glassStyles.blur,
								"rounded-md",
								glassStyles.shadow,
							)}
							style={{
								maxWidth: "100%",
								maxHeight: "100%",
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
