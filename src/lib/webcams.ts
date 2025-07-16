/** @public */
export async function getAvailableWebcams(): Promise<MediaDeviceInfo[]> {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();

		return devices.filter((device) => device.kind === "videoinput");
	} catch (error) {
		console.error("Error accessing media devices:", error);
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
