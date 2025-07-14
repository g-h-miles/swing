import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithRefresh } from "jotai/utils";
import { useEffect } from "react";

import { atomStore } from "./atom-store";
import {
	cameraPermissionAtom,
	readCameraPermissionAtom,
} from "./permission-atom";

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
		setAtom((prev) => ({ ...prev, isLoading: true }));

		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const webcams = devices.filter((device) => device.kind === "videoinput");
			setAtom({
				devices: webcams,
				isLoading: false,
				error: null,
			});
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
			console.log("first time, skipping");
			init = null;
			return;
		}
		console.log("refreshing webcams");
		refresh();
	});

	const permissionState = atomStore.get(readCameraPermissionAtom);
	if (permissionState === "granted") {
		refresh();
	}

	navigator.mediaDevices.addEventListener("devicechange", refresh);

	return () => {
		navigator.mediaDevices.removeEventListener("devicechange", refresh);
		unsubscribe();
	};
};

const refreshWebcamsAtom = atom(null, async (_get, set) => {
	// set(baseAvailableWebcamsAtom, (prev) => ({ ...prev, isLoading: true }));

	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const webcams = devices.filter((device) => device.kind === "videoinput");
		set(baseAvailableWebcamsAtom, {
			devices: webcams,
			isLoading: false,
			error: null,
		});
	} catch (error) {
		set(baseAvailableWebcamsAtom, {
			devices: [],
			isLoading: false,
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

export const availableWebcamsAtom = atom((get) =>
	get(baseAvailableWebcamsAtom),
);
export { refreshWebcamsAtom };

// baseAvailableWebcamsAtom.onMount = () => {
// 	atomStore.sub(baseAvailableWebcamsAtom, () => {
// 		console.log(
// 			"baseAvailableWebcamsAtom changed to:",
// 			atomStore.get(baseAvailableWebcamsAtom),
// 		);
// 	});
// };

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
