import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";

type WebcamSimple = {
	deviceId: string | null;
	videoEnabled: boolean;
};

export const webcamAtomFamily = atomFamily((key: string) => {
	const webcamAtom = atomWithStorage<WebcamSimple>(`webcam-atom-${key}`, {
		deviceId: null,
		videoEnabled: false,
	});

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
