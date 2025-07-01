import { glassStyles } from "@/glass";
import { useAvailableWebcamsQuery } from "@/lib/hooks/use-available-webcams";
import { cn } from "@/lib/utils";

import { useSelectedWebcam, useVideoEnabled } from "@/lib/hooks/use-persisted";
import { useDefault } from "@uidotdev/usehooks";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Webcam } from "./ui/webcam";
import { WebcamDropdown } from "./webcam-dropdown";
import { WebcamStatusText } from "./webcam-status-description";

export const storageKeys = {
	camera: "camera",
	videoEnabled: "videoEnabled",
};

export const WebcamPanelContent = ({
	panelId,
	className,
}: {
	panelId: string;
	className?: string;
}) => {
	const [panelCamera, setPanelCamera] = useSelectedWebcam(panelId);
	const [panelVideoEnabled, setPanelVideoEnabled] = useLocalStorage(
		`${panelId}.${storageKeys.videoEnabled}`,
		false,
	);
	const { isLoading: isWebcamsLoading, data: webcams } =
		useAvailableWebcamsQuery();

	useEffect(() => {
		if (panelCamera && webcams) {
			setPanelCamera(
				webcams?.find(
					(camera: MediaDeviceInfo) => camera.deviceId === panelCamera.deviceId,
				) || null,
			);
		}
	}, [panelCamera, webcams, setPanelCamera]);

	const handleCameraSelect = (camera: MediaDeviceInfo) => {
		setPanelCamera(camera);
	};
	const handleVideoStart = () => {
		setPanelVideoEnabled(true);
	};
	const handleVideoStop = () => {
		setPanelVideoEnabled(false);
	};

	return (
		<div
			className={cn(
				"relative h-full w-full",
				!panelVideoEnabled && "border border-border rounded-md",
				className,
			)}
		>
			<div className="absolute top-2 left-2 z-10">
				{!isWebcamsLoading && (
					<WebcamStatusText
						status={
							!panelCamera?.deviceId
								? "inactive"
								: panelVideoEnabled
									? "live"
									: "ready"
						}
					/>
				)}
			</div>
			<div className="absolute top-2 right-2 z-10">
				<WebcamDropdown
					panelId={panelId}
					onCameraSelect={handleCameraSelect}
					onVideoStart={handleVideoStart}
					onVideoStop={handleVideoStop}
				/>
			</div>
			{panelVideoEnabled && (
				<div className="relative w-full h-full flex items-center justify-center overflow-hidden">
					<Webcam
						mirrored={true}
						audio={true}
						muted={true}
						videoConstraints={{
							deviceId: panelCamera?.deviceId,
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
