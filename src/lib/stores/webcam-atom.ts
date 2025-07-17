import { readAvailableWebcamsAtom } from "@/lib/stores/available-webcams-atom";
import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { atomStore } from "./atom-store";
import { readCameraPermissionAtom } from "./permission-atom";

type SelectedWebcamSimple = {
	deviceId: string | null;
	videoEnabled: boolean;
};

const selectedWebcamAtomFamily = atomFamily((key: string) => {
	const webcamAtom = atomWithStorage<SelectedWebcamSimple>(
		`webcam-atom-${key}`,
		{
			deviceId: null,
			videoEnabled: false,
		},
	);
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

export const readSelectedWebcamAtom = atomFamily((key: string) => {
	return atom((get) => get(selectedWebcamAtomFamily(key)));
});

export const setSelectedDeviceIdAtom = atomFamily((key: string) => {
	return atom(null, (_get, set, deviceId: string | null) => {
		set(selectedWebcamAtomFamily(key), { videoEnabled: false, deviceId });
	});
});

export const toggleSelectedVideoEnabledAtom = atomFamily((key: string) => {
	return atom(null, (_get, set) => {
		set(selectedWebcamAtomFamily(key), (prev) => ({
			...prev,
			videoEnabled: !prev.videoEnabled,
		}));
	});
});
