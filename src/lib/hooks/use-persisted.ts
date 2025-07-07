//use-persisted.ts hook
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { z } from "zod";
import { useAvailableWebcamsQuery } from "./use-available-webcams";

const storageKeys = {
	camera: "camera",
	videoEnabled: "videoEnabled",
};

const MediaDeviceInfoSchema = z.object({
	groupId: z.string(),
	deviceId: z.string(),
	label: z.string(),
	kind: z.string(),
});

const useSelectedWebcam_ = (panelId: string) => {
	const [panelCamera, setPanelCamera] = useLocalStorage<MediaDeviceInfo | null>(
		`${panelId}.${storageKeys.camera}`,
		null,
	);
};

export const useSelectedWebcam = (panelId: string) => {
	const { data: webcams } = useAvailableWebcamsQuery();
	const [panelCamera, setPanelCamera] = useLocalStorage<MediaDeviceInfo | null>(
		`${panelId}.${storageKeys.camera}`,
		null,
	);

	useEffect(() => {
		if (panelCamera) {
			const parsed = MediaDeviceInfoSchema.safeParse(panelCamera);
			if (!parsed.success) {
				setPanelCamera(null);
				return;
			}
			if (webcams) {
				setPanelCamera(
					webcams?.find((camera) => camera.deviceId === panelCamera.deviceId) ||
						null,
				);
			}
		}
	}, [panelCamera, webcams, setPanelCamera]);

	return [panelCamera, setPanelCamera] as const;
};

export const useVideoEnabled = (panelId: string) => {
	const [panelVideoEnabled, setPanelVideoEnabled] = useLocalStorage(
		`${panelId}.${storageKeys.videoEnabled}`,
		false,
	);
	return [panelVideoEnabled, setPanelVideoEnabled] as const;
};
