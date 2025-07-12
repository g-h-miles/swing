//webcam-dropdown.tsx component

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
import { requestCameraAndMicrophoneStream } from "@/lib/webcams";
import type React from "react";
import { useCallback, useState } from "react";

import {
	readRequestPermissionStatusAtom,
	requestPermissionAtom,
} from "@/lib/stores/webcam-atom";

import {
	readWebcamAtom,
	setDeviceIdAtom,
	toggleVideoEnabledAtom,
} from "@/lib/stores/webcam-atom";
import { useAtomValue, useSetAtom } from "jotai";

import {
	CameraIcon,
	GearSixIcon,
	SpinnerGapIcon,
	VideoCameraIcon,
	VideoCameraSlashIcon,
	WarningCircleIcon,
} from "@phosphor-icons/react";

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
}: {
	panelId: string;
}) {
	const selection = useAtomValue(readWebcamAtom(panelId));
	const setDeviceId = useSetAtom(setDeviceIdAtom(panelId));
	const toggleVideo = useSetAtom(toggleVideoEnabledAtom(panelId));

	const {
		data: cameraPermission,
		isLoading: isCameraLoading,
		isError: isCameraError,
	} = useCameraPermissionQuery();

	const {
		data: webcams,
		isLoading: isWebcamsLoading,
		isError: isWebcamsError,
		refetch: refetchWebcams,
	} = useAvailableWebcamsQuery();

	const requestPermissionStatus = useAtomValue(readRequestPermissionStatusAtom);

	const handleRequestPermission = useSetAtom(requestPermissionAtom);

	// const handleRequestPermission = useCallback(async () => {
	// 	setRequestPermissionStatus("loading");
	// 	try {
	// 		await requestCameraAndMicrophoneStream();
	// 		await refetchWebcams();
	// 		setRequestPermissionStatus("success");
	// 	} catch (error) {
	// 		console.log("Permission request failed:", error);
	// 		setRequestPermissionStatus("error");
	// 	}
	// }, [refetchWebcams]);

	if (!selection) {
		return (
			<Button
				variant="ghost"
				className="w-10 h-10 p-0 cursor-wait" // Use cursor-wait
				disabled={true}
				title="Initializing..."
			>
				<SpinnerGapIcon className="w-4 h-4 animate-spin" />
			</Button>
		);
	}

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

	const getCameraLabel = (cameraId: string) => {
		const camera = webcams?.find((camera) => camera.deviceId === cameraId);
		if (!camera) {
			return;
		}
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

	const isPermissionGranted = cameraPermission?.state === "granted";
	const isStillLoading = isCameraLoading || isWebcamsLoading;
	const hasError = isCameraError || isWebcamsError;

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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={`w-10 h-10 p-0 cursor-pointer ${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} ${glassStyles.buttonHover} ${glassStyles.transition} ${glassStyles.primaryText}`}
					title={"Select Camera"}
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
							onClick={() => setDeviceId(camera.deviceId)}
							className={`${glassStyles.menuItem} ${glassStyles.hover} focus:${glassStyles.hover.replace("hover:", "")} ${glassStyles.borderRadius} ${glassStyles.transition} ${glassStyles.primaryText} text-sm ${
								selection.deviceId === camera.deviceId
									? glassStyles.selected
									: ""
							}`}
						>
							<CameraIcon className="w-3 h-3" />
							<span className="flex-1 font-medium">
								{getCameraLabel(camera.deviceId)}
							</span>
							{selection.deviceId === camera.deviceId && (
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
									selection.videoEnabled ? (
										<VideoCameraSlashIcon className="w-3 h-3" />
									) : (
										<VideoCameraIcon className="w-3 h-3" />
									)
								}
								onClick={toggleVideo}
							>
								{selection.videoEnabled ? "Turn Off" : "Turn On"}
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
