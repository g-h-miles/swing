import { useEffect, useRef } from "react";
import { useCameraPermissionQuery } from "./use-permission";

const useWebcamStream = (deviceId: string | null) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const { data: cameraPermission } = useCameraPermissionQuery();

	useEffect(() => {
		if (!deviceId) return;

		const startStream = async () => {
			try {
				// Check if we have permission first
				if (cameraPermission?.state === "denied") {
					console.log("Camera permission denied, skipping stream setup");
					return;
				}

				if (videoRef.current?.srcObject) {
					const stream = videoRef.current.srcObject as MediaStream;
					for (const track of stream.getTracks()) {
						track.stop();
					}
				}

				const stream = await navigator.mediaDevices.getUserMedia({
					video: { deviceId: { exact: deviceId } },
				});

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			} catch (err) {
				console.error("Failed to start webcam stream:", err);
			}
		};

		startStream();

		return () => {
			if (videoRef.current?.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream;
				for (const track of stream.getTracks()) {
					track.stop();
				}
			}
		};
	}, [deviceId, cameraPermission?.state]);

	return videoRef;
};

export default useWebcamStream;
