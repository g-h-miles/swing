//webcam-dropdown.tsx component

import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { glassStyles } from "@/glass";
import { useAvailableWebcamsQuery } from "@/lib/hooks/use-available-webcams";
import { useCameraPermissionQuery } from "@/lib/hooks/use-permission";
import { useSelectedWebcam, useVideoEnabled } from "@/lib/hooks/use-persisted";
import { requestCameraAndMicrophoneStream } from "@/lib/webcams";

import {
	CameraIcon,
	GearSixIcon,
	SpinnerGapIcon,
	VideoCameraIcon,
	VideoCameraSlashIcon,
	WarningCircleIcon,
} from "@phosphor-icons/react";
import { useDefault } from "@uidotdev/usehooks";

interface MenuItemProps {
	icon: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

const MenuItem = ({
	icon,
	children,
	className = "",
	onClick,
}: MenuItemProps) => (
	<DropdownMenuItem
		onClick={onClick}
		className={`${glassStyles.menuItem} ${glassStyles.hover} focus:${glassStyles.hover.replace("hover:", "")} ${glassStyles.borderRadius} ${glassStyles.transition} font-medium ${glassStyles.primaryText} text-sm ${className}`}
	>
		{icon}
		<span>{children}</span>
	</DropdownMenuItem>
);

type RequestPermissionStatus = "idle" | "loading" | "error" | "success";

export function WebcamDropdown({
	panelId,
	onCameraSelect,
	onVideoStart,
	onVideoStop,
}: {
	panelId: string;
	onCameraSelect: (camera: MediaDeviceInfo) => void;
	onVideoStart: () => void;
	onVideoStop: () => void;
}) {
	const {
		data: cameraPermission,
		isLoading: isCameraLoading,
		isError: isCameraError,
	} = useCameraPermissionQuery();
	const {
		data: webcams,
		isLoading: isWebcamsLoading,
		isError: isWebcamsError,
	} = useAvailableWebcamsQuery();

	const [selectedCamera] = useSelectedWebcam(panelId);
	const [isVideoEnabled, setIsVideoEnabled] = useVideoEnabled(panelId);
	const [requestPermissionStatus, setRequestPermissionStatus] =
		useState<RequestPermissionStatus>("idle");

	const handleCameraSelect = useCallback(
		(camera: MediaDeviceInfo) => {
			onCameraSelect(camera);
		},
		[onCameraSelect],
	);

	const handleRequestPermission = async () => {
		setRequestPermissionStatus("loading");
		try {
			await requestCameraAndMicrophoneStream();
			setRequestPermissionStatus("success");
			// refetchWebcams()
		} catch (error) {
			console.log("Permission request failed:", error);
			setRequestPermissionStatus("error");
		}
	};

	const handleVideoToggle = () => {
		setIsVideoEnabled(!isVideoEnabled);
		if (!isVideoEnabled) {
			onVideoStart();
		} else {
			onVideoStop();
		}
	};

	const getButtonIcon = () => {
		if (
			isCameraLoading ||
			isWebcamsLoading ||
			requestPermissionStatus === "loading"
		) {
			return <SpinnerGapIcon className="w-4 h-4 animate-spin" />;
		}
		if (
			isCameraError ||
			isWebcamsError ||
			requestPermissionStatus === "error"
		) {
			return <WarningCircleIcon className="w-4 h-4 text-red-400" />;
		}
		if (cameraPermission?.state === "granted") {
			return <VideoCameraIcon className="w-4 h-4" />;
		}

		return <VideoCameraSlashIcon className="w-4 h-4" />;
	};

	const getCameraLabel = (camera: MediaDeviceInfo) => {
		// Handle blank camera labels
		return (
			camera.label ||
			`Camera ${camera.deviceId.slice(0, 8)}...` ||
			"Unknown Camera"
		);
	};

	const getStatusMessage = () => {
		if (
			isCameraLoading ||
			isWebcamsLoading ||
			requestPermissionStatus === "loading"
		) {
			return "Loading camera permissions...";
		}
		if (
			isCameraError ||
			isWebcamsError ||
			requestPermissionStatus === "error"
		) {
			return "Permission denied. Check browser camera settings.";
		}
		if (cameraPermission?.state === "denied") {
			return "Camera blocked. Check browser camera settings.";
		}
		return "Click to allow camera access";
	};

	// Show loading/error states even when permission is unknown
	const isPermissionGranted = cameraPermission?.state === "granted";
	const isStillLoading = isCameraLoading || isWebcamsLoading;
	const hasError = isCameraError || isWebcamsError;

	// Always show button if loading, error, or permission not granted
	if (!isPermissionGranted || isStillLoading || hasError) {
		return (
			<Button
				variant="ghost"
				className={`w-10 h-10 p-0 cursor-pointer ${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} ${glassStyles.buttonHover} ${glassStyles.transition} ${glassStyles.primaryText}`}
				disabled={isStillLoading}
				onClick={handleRequestPermission}
				title={getStatusMessage()}
			>
				{getButtonIcon()}
			</Button>
		);
	}

	// Permission granted - show dropdown
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={`w-10 h-10 p-0 cursor-pointer ${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} ${glassStyles.buttonHover} ${glassStyles.transition} ${glassStyles.primaryText}`}
					title={
						selectedCamera ? getCameraLabel(selectedCamera) : "Select Camera"
					}
				>
					<VideoCameraIcon className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className={`w-56 ${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} p-0 mt-2`}
				align="end"
				side="bottom"
				sideOffset={4}
				alignOffset={0}
				avoidCollisions={false}
			>
				<div className="p-1">
					{!webcams?.length && (
						<div className="px-2 py-1.5 text-xs text-white/50">
							No cameras available
						</div>
					)}

					{webcams?.map((camera) => (
						<DropdownMenuItem
							key={camera.deviceId}
							onClick={() => handleCameraSelect(camera)}
							className={`${glassStyles.menuItem} ${glassStyles.hover} focus:${glassStyles.hover.replace("hover:", "")} ${glassStyles.borderRadius} ${glassStyles.transition} ${glassStyles.primaryText} text-sm ${
								selectedCamera?.deviceId === camera.deviceId
									? glassStyles.selected
									: ""
							}`}
						>
							<CameraIcon className="w-3 h-3" />
							<span className="flex-1 font-medium">
								{getCameraLabel(camera)}
							</span>
							{selectedCamera?.deviceId === camera.deviceId && (
								<div
									className={`w-1.5 h-1.5 ${glassStyles.indicator} rounded-full`}
								/>
							)}
						</DropdownMenuItem>
					))}

					{webcams?.length && (
						<>
							<DropdownMenuSeparator className={`my-1 ${glassStyles.border}`} />

							<MenuItem
								icon={
									isVideoEnabled ? (
										<VideoCameraSlashIcon className="w-3 h-3" />
									) : (
										<VideoCameraIcon className="w-3 h-3" />
									)
								}
								onClick={handleVideoToggle}
							>
								{isVideoEnabled ? "Turn Off" : "Turn On"}
							</MenuItem>

							<MenuItem icon={<GearSixIcon className="w-3 h-3" />}>
								Settings
							</MenuItem>
						</>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
