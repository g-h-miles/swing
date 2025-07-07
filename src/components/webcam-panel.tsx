//webcam-panel.tsx component
import { glassStyles } from "@/glass";
import { useWebcamStore } from "@/lib/stores/webcam-store";
import { cn } from "@/lib/utils";
import { Webcam } from "./ui/webcam";
import { WebcamDropdown } from "./webcam-dropdown";
import { WebcamStatusText } from "./webcam-status-description";

export const WebcamPanelContent = ({
	panelId,
	className,
	availableWebcams,
}: {
	panelId: string;
	className?: string;
	availableWebcams: MediaDeviceInfo[];
}) => {
	const selection = useWebcamStore((state) => state.selections[panelId]);
	if (!selection) {
		return null;
	}
	const { deviceId, videoEnabled } = selection;

	return (
		<div className="p-1 size-full @container">
			<div
				className={cn(
					"relative h-full w-full",
					!videoEnabled && "border border-border rounded-md",
					className,
				)}
			>
				<div className="absolute top-2 left-2 z-10">
					{true && (
						<WebcamStatusText
							status={!deviceId ? "inactive" : videoEnabled ? "live" : "ready"}
						/>
					)}
				</div>
				<div className="absolute top-2 right-2 z-10">
					<WebcamDropdown
						panelId={panelId}
						availableWebcams={availableWebcams}
						// onCameraSelect={handleCameraSelect}
						// onVideoStart={handleVideoStart}
						// onVideoStop={handleVideoStop}
					/>
				</div>
				{videoEnabled && deviceId && (
					<div className="relative w-full h-full flex items-center justify-center overflow-hidden">
						<Webcam
							mirrored={true}
							audio={true}
							muted={true}
							videoConstraints={{
								deviceId: deviceId,
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
