import { useAvailableWebcams } from "@/lib/hooks/use-available-webcams";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Webcam } from "./webcam";
import { WebcamDropdown } from "./webcam-dropdown";
import { glassStyles } from "./webcam-dropdown";
import { WebcamStatusText } from "./webcam-status-description";

export const WebcamPanelContent = ({
	className,
}: {
	className?: string;
}) => {
	const [panelOneCamera, setPanelOneCamera] = useState<MediaDeviceInfo | null>(
		null,
	);
	const [panelOneVideoEnabled, setPanelOneVideoEnabled] = useState(false);
	const { isLoading: isWebcamsLoading } = useAvailableWebcams();

	const handleCameraSelect = (camera: MediaDeviceInfo) => {
		console.log("camera selected", camera);
		setPanelOneCamera(camera);
	};
	const handleVideoStart = () => {
		console.log("video started");
		setPanelOneVideoEnabled(true);
	};
	const handleVideoStop = () => {
		setPanelOneVideoEnabled(false);
	};

	return (
		<div
			className={cn(
				"relative h-full w-full",
				!panelOneVideoEnabled && "border border-border rounded-md",
				className,
			)}
		>
			<div className="absolute top-2 left-2 z-10">
				{!isWebcamsLoading && (
					<WebcamStatusText
						status={
							!panelOneCamera?.deviceId
								? "inactive"
								: panelOneVideoEnabled
									? "live"
									: "ready"
						}
					/>
				)}
			</div>
			<div className="absolute top-2 right-2 z-10">
				<WebcamDropdown
					onCameraSelect={handleCameraSelect}
					onVideoStart={handleVideoStart}
					onVideoStop={handleVideoStop}
				/>
			</div>
			{panelOneVideoEnabled && (
				<div className="relative w-full h-full flex items-center justify-center overflow-hidden">
					<Webcam
						mirrored={true}
						audio={true}
						muted={true}
						videoConstraints={{
							deviceId: panelOneCamera?.deviceId,
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
	);
};
