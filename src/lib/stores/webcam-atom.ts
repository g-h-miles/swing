import { readAvailableWebcamsAtom } from "@/lib/stores/available-webcams-atom";
import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { atomStore } from "./atom-store";
import { readCameraPermissionAtom } from "./permission-atom";

type WebcamSimple = {
	deviceId: string | null;
	videoEnabled: boolean;
};

const webcamAtomFamily = atomFamily((key: string) => {
	const webcamAtom = atomWithStorage<WebcamSimple>(`webcam-atom-${key}`, {
		deviceId: null,
		videoEnabled: false,
	});
	webcamAtom.onMount = (setAtom) => {
		const unsubscribeFromPermissions = atomStore.sub(
			readCameraPermissionAtom,
			() => {
				console.log("readCameraPermissionAtom changed", key);
				const currentSelection = atomStore.get(webcamAtom);
				const currentPermissions = atomStore.get(readCameraPermissionAtom);

				if (
					currentSelection.deviceId &&
					(currentPermissions === "prompt" || currentPermissions === "denied")
				) {
					setAtom({ deviceId: null, videoEnabled: false });
				}
			},
		);

		const unsubscribeFromWebcams = atomStore.sub(
			readAvailableWebcamsAtom,
			() => {
				const currentSelection = atomStore.get(webcamAtom);
				const currentWebcams = atomStore.get(readAvailableWebcamsAtom);

				if (
					currentSelection.deviceId &&
					(currentWebcams.length === 0 ||
						!currentWebcams.find(
							(webcam) => webcam.deviceId === currentSelection.deviceId,
						))
				) {
					setAtom({ deviceId: null, videoEnabled: false });
				}
			},
		);

		return () => {
			unsubscribeFromPermissions();
			unsubscribeFromWebcams();
		};
	};

	return webcamAtom;
});

export const readWebcamAtom = atomFamily((key: string) => {
	return atom((get) => get(webcamAtomFamily(key)));
});

export const setDeviceIdAtom = atomFamily((key: string) => {
	return atom(null, (_get, set, deviceId: string | null) => {
		set(webcamAtomFamily(key), { videoEnabled: false, deviceId });
	});
});

export const toggleVideoEnabledAtom = atomFamily((key: string) => {
	return atom(null, (_get, set) => {
		set(webcamAtomFamily(key), (prev) => ({
			...prev,
			videoEnabled: !prev.videoEnabled,
		}));
	});
});
