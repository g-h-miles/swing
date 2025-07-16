import { readRequestPermissionStatusAtom } from "@/lib/stores/permission-atom";
import {
	readCameraPermissionAtom,
	readCameraPermissionErrorAtom,
	readCameraPermissionIsLoadingAtom,
	readIsCameraPermissionGrantedAtom,
} from "./permission-atom";

import { atom } from "jotai";
import {
	readAvailableWebcamsErrorAtom,
	readAvailableWebcamsLoadingAtom,
} from "./available-webcams-atom";

type AllowedWebcamsState = "loading" | "error" | "granted" | "denied";

export const readAllowedWebcamsStateAtom = atom<AllowedWebcamsState>((get) => {
	const isPermissionLoading = get(readCameraPermissionIsLoadingAtom);
	const isPermissionError = get(readCameraPermissionErrorAtom);
	const permissionStatus = get(readRequestPermissionStatusAtom);
	const isPermissionGranted = get(readIsCameraPermissionGrantedAtom);
	const isWebcamsLoading = get(readAvailableWebcamsLoadingAtom);
	const isWebcamsError = get(readAvailableWebcamsErrorAtom);

	if (
		isPermissionLoading ||
		isWebcamsLoading ||
		permissionStatus === "loading"
	) {
		return "loading";
	}

	if (isPermissionError || isWebcamsError || permissionStatus === "error") {
		return "error";
	}

	if (
		(permissionStatus === "idle" || permissionStatus === "success") &&
		isPermissionGranted
	) {
		return "granted";
	}

	if (!isPermissionGranted) {
		return "denied";
	}

	return "error";
});
