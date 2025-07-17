import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { glassStyles } from "@/glass";
import {
	readAvailableWebcamsAtom,
	readAvailableWebcamsLengthAtom,
} from "@/lib/stores/available-webcams-atom";

import type React from "react";

import { requestPermissionAtom } from "@/lib/stores/permission-atom";

import {
	readSelectedWebcamAtom,
	setSelectedDeviceIdAtom,
	toggleSelectedVideoEnabledAtom,
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

import { readAllowedWebcamsStateAtom } from "@/lib/stores/allowed-webcams";

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

export function WebcamDropdown({ panelId }: { panelId: string }) {
	const selection = useAtomValue(readSelectedWebcamAtom(panelId));
	const setDeviceId = useSetAtom(setSelectedDeviceIdAtom(panelId));
	const toggleVideo = useSetAtom(toggleSelectedVideoEnabledAtom(panelId));
	const availableWebcams_ = useAtomValue(readAvailableWebcamsAtom);
	const availableWebcamsLength = useAtomValue(readAvailableWebcamsLengthAtom);
	const allowedWebcamsState = useAtomValue(readAllowedWebcamsStateAtom);

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

	const getCameraLabel = (cameraId: string) => {
		const camera = availableWebcams_.find(
			(camera) => camera.deviceId === cameraId,
		);
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

	if (allowedWebcamsState !== "granted") {
		return <PermissionButton />;
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
					{availableWebcamsLength === 0 && (
						<div className="px-2 py-1.5 text-xs text-white/50">
							No cameras available
						</div>
					)}

					{availableWebcams_.map((camera) => (
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

					{availableWebcamsLength > 0 && (
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

const PermissionButton = () => {
	const allowedWebcamsState = useAtomValue(readAllowedWebcamsStateAtom);
	const handleRequestPermission = useSetAtom(requestPermissionAtom);

	const getButtonIcon = () => {
		if (allowedWebcamsState === "loading") {
			return <SpinnerGapIcon className="w-4 h-4 animate-spin" />;
		}
		if (allowedWebcamsState === "error") {
			return <WarningCircleIcon className="w-4 h-4 text-red-400" />;
		}
		if (allowedWebcamsState === "granted") {
			return <VideoCameraIcon className="w-4 h-4" />;
		}

		return <VideoCameraSlashIcon className="w-4 h-4" />;
	};

	const getStatusMessage = () => {
		if (allowedWebcamsState === "loading") {
			return "Loading camera permissions...";
		}
		if (allowedWebcamsState === "error") {
			return "Permission denied. Check browser camera settings.";
		}
		if (allowedWebcamsState === "denied") {
			return "Camera blocked. Check browser camera settings.";
		}
		return "Click to allow camera access";
	};

	return (
		<Button
			variant="ghost"
			className={`w-10 h-10 p-0 cursor-pointer ${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} ${glassStyles.buttonHover} ${glassStyles.transition} ${glassStyles.primaryText}`}
			disabled={allowedWebcamsState === "loading"}
			onClick={handleRequestPermission}
			title={getStatusMessage()}
		>
			{getButtonIcon()}
		</Button>
	);
};
