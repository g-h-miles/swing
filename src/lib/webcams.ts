import { safeJsonParse } from "./utils";

export async function getAvailableWebcams(): Promise<MediaDeviceInfo[]> {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();

		return devices.filter((device) => device.kind === "videoinput");
	} catch (error) {
		console.error("Error accessing media devices:", error);
		throw error;
	}
}

export async function requestCameraStream() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		return stream;
	} catch (error) {
		console.error("Error requesting camera:", error);
		throw error;
	}
}

export async function requestMicrophoneStream() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		return stream;
	} catch (error) {
		console.error("Error requesting microphone:", error);
		throw error;
	}
}

export async function requestCameraAndMicrophoneStream() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		return stream;
	} catch (error) {
		console.error("Error requesting camera and microphone:", error);
		throw error;
	}
}

export const storage: Storage = localStorage;
export const storageKeys = {
	camera: "camera",
	videoEnabled: "videoEnabled",
};

export const getPanelStorage = (storageKey: string) => {
	const selectedCameraString = storage.getItem(
		`${storageKey}.${storageKeys.camera}`,
	);
	const videoEnabledString = storage.getItem(
		`${storageKey}.${storageKeys.videoEnabled}`,
	);
	return {
		selectedCameraString,
		videoEnabledString,
	};
};

export const loadPanelStorage = async () => {
	const storageKey = "panel-one";
	const { selectedCameraString, videoEnabledString } =
		getPanelStorage(storageKey);
	const selectedCameraParsed = safeJsonParse<MediaDeviceInfo>(
		selectedCameraString ?? "",
	);
	const videoEnabled = safeJsonParse<boolean>(videoEnabledString ?? "false");
	const webcams = await getAvailableWebcams();
	const selectedCamera = webcams.find(
		(webcam) => webcam.deviceId === selectedCameraParsed?.deviceId,
	);
	return { webcams, selectedCamera, videoEnabled };
};
