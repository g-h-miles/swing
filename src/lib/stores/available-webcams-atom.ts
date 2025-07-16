import { atom } from "jotai";

import { atomStore } from "./atom-store";
import { readCameraPermissionAtom } from "./permission-atom";

interface WebcamsState {
	devices: MediaDeviceInfo[];
	isLoading: boolean;
	error: string | null;
}

const INIT = Symbol("init");

const baseAvailableWebcamsAtom = atom<WebcamsState>({
	devices: [],
	isLoading: false,
	error: null,
});

baseAvailableWebcamsAtom.onMount = (setAtom) => {
	let init: symbol | null = INIT;

	const refresh = async () => {
		console.log("refreshing webcams");
		setAtom((prev) => ({ ...prev, isLoading: true }));

		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const webcams = devices.filter((device) => device.kind === "videoinput");
			setAtom({
				devices: webcams,
				isLoading: false,
				error: null,
			});
			console.log("webcams refreshed");
		} catch (error) {
			setAtom({
				devices: [],
				isLoading: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	};
	const unsubscribe = atomStore.sub(readCameraPermissionAtom, () => {
		const currentState = atomStore.get(readCameraPermissionAtom);
		console.log("Permission state changed to:", currentState);

		if (init === INIT) {
			if (currentState === "granted") {
				console.log("permission granted, refreshing webcams");
				refresh();
			}
			init = null;
			return;
		}
		console.log("refreshing webcams");
		refresh();
	});

	navigator.mediaDevices.addEventListener("devicechange", refresh);

	return () => {
		navigator.mediaDevices.removeEventListener("devicechange", refresh);
		unsubscribe();
	};
};

export const availableWebcamsAtom = atom((get) =>
	get(baseAvailableWebcamsAtom),
);
/** @public */
export const readAvailableWebcamsAtom = atom(
	(get) => get(availableWebcamsAtom).devices,
);

export const readAvailableWebcamsLengthAtom = atom(
	(get) => get(availableWebcamsAtom).devices.length,
);

export const readAvailableWebcamsLoadingAtom = atom(
	(get) => get(availableWebcamsAtom).isLoading,
);

export const readAvailableWebcamsErrorAtom = atom(
	(get) => get(availableWebcamsAtom).error,
);
