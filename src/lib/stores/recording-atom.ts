import { useConvexMutation } from "@convex-dev/react-query";
import { atom } from "jotai";
import { atomWithMutation } from "jotai-tanstack-query";
import { atomFamily } from "jotai/utils";
import { api } from "../../../convex/_generated/api";

export type RecordingState = {
	isRecording: boolean;
	recordingDuration: number;
	recordedBlob: Blob | null;
	startTime: number | null;
	mediaRecorder: MediaRecorder | null;
	mediaStream: MediaStream | null;
	error: string | null;
};

const recordingStateAtomFamily = atomFamily((_panelId: string) =>
	atom<RecordingState>({
		isRecording: false,
		recordingDuration: 0,
		recordedBlob: null,
		startTime: null,
		mediaRecorder: null,
		mediaStream: null,
		error: null,
	}),
);

export const readRecordingStateAtom = atomFamily((panelId: string) =>
	atom((get) => get(recordingStateAtomFamily(panelId))),
);

export const readRecordingIsRecordingAtom = atomFamily((panelId: string) =>
	atom((get) => get(recordingStateAtomFamily(panelId)).isRecording),
);

export const readRecordingDurationAtom = atomFamily((panelId: string) =>
	atom((get) => get(recordingStateAtomFamily(panelId)).recordingDuration),
);

export const readRecordingDurationMinutesAtom = atomFamily((panelId: string) =>
	atom((get) => {
		const duration = get(recordingStateAtomFamily(panelId)).recordingDuration;
		return Math.floor(duration / 1000);
	}),
);

export const startRecordingAtom = atomFamily((panelId: string) =>
	atom(null, async (_get, set, deviceId: string) => {
		const currentState = _get(recordingStateAtomFamily(panelId));
		if (currentState.isRecording) return;

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: deviceId } },
				audio: true,
			});

			const mediaRecorder = new MediaRecorder(mediaStream, {
				mimeType: "video/webm;codecs=vp9",
			});

			const chunks: Blob[] = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunks.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const recordedBlob = new Blob(chunks, { type: "video/webm" });
				set(recordingStateAtomFamily(panelId), (prev) => ({
					...prev,
					recordedBlob,
				}));

				// Auto-download the recording
				const url = URL.createObjectURL(recordedBlob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `recording-${panelId}-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			};

			mediaRecorder.onerror = (event) => {
				console.error("MediaRecorder error:", event);
				set(recordingStateAtomFamily(panelId), (prev) => ({
					...prev,
					error: "Recording failed",
					isRecording: false,
					mediaRecorder: null,
					mediaStream: null,
				}));
			};

			mediaRecorder.start(100); // Collect data every 100ms

			set(recordingStateAtomFamily(panelId), {
				...currentState,
				isRecording: true,
				startTime: Date.now(),
				recordingDuration: 0,
				recordedBlob: null,
				mediaRecorder,
				mediaStream,
				error: null,
			});

			// Start duration timer
			const durationInterval = setInterval(() => {
				const state = _get(recordingStateAtomFamily(panelId));
				if (!state.isRecording) {
					clearInterval(durationInterval);
					return;
				}
				const duration = Date.now() - (state.startTime || 0);
				set(updateRecordingDurationAtom(panelId), duration);
			}, 100);
		} catch (error) {
			console.error("Failed to start recording:", error);
			set(recordingStateAtomFamily(panelId), {
				...currentState,
				error:
					error instanceof Error ? error.message : "Failed to access camera",
			});
		}
	}),
);

export const stopRecordingAtom = atomFamily((panelId: string) =>
	atom(null, (_get, set) => {
		const currentState = _get(recordingStateAtomFamily(panelId));
		if (!currentState.isRecording) return;

		// Stop MediaRecorder
		if (currentState.mediaRecorder) {
			currentState.mediaRecorder.stop();
		}

		// Stop media stream tracks
		if (currentState.mediaStream) {
			currentState.mediaStream.getTracks().forEach((track) => track.stop());
		}

		set(recordingStateAtomFamily(panelId), {
			...currentState,
			isRecording: false,
			startTime: null,
			mediaRecorder: null,
			mediaStream: null,
		});
	}),
);

export const generateUploadUrlMutationAtom = atomFamily((_panelId: string) =>
	atomWithMutation(() => ({
		mutationFn: useConvexMutation(api.replay.generateUploadUrl),
	})),
);

export const stopRecordingMutationAtom = atomFamily((_panelId: string) =>
	atomWithMutation(() => ({
		mutationFn: useConvexMutation(api.replay.sendMessage),
	})),
);

export const updateRecordingDurationAtom = atomFamily((panelId: string) =>
	atom(null, (_get, set, duration: number) => {
		const currentState = _get(recordingStateAtomFamily(panelId));
		if (currentState.isRecording) {
			set(recordingStateAtomFamily(panelId), {
				...currentState,
				recordingDuration: duration,
			});
		}
	}),
);

export const downloadRecordingAtom = atomFamily((panelId: string) =>
	atom(null, (_get, set) => {
		const currentState = _get(recordingStateAtomFamily(panelId));
		if (!currentState.recordedBlob) return;

		const url = URL.createObjectURL(currentState.recordedBlob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `recording-${panelId}-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}),
);
