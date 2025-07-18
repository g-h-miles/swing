import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export type RecordingState = {
	isRecording: boolean;
	recordingDuration: number;
	recordedBlob: Blob | null;
	startTime: number | null;
};

const recordingStateAtomFamily = atomFamily((_panelId: string) =>
	atom<RecordingState>({
		isRecording: false,
		recordingDuration: 0,
		recordedBlob: null,
		startTime: null,
	}),
);

export const readRecordingStateAtom = atomFamily((panelId: string) =>
	atom((get) => get(recordingStateAtomFamily(panelId))),
);

export const startRecordingAtom = atomFamily((panelId: string) =>
	atom(null, (_get, set) => {
		const currentState = _get(recordingStateAtomFamily(panelId));
		if (!currentState.isRecording) {
			set(recordingStateAtomFamily(panelId), {
				...currentState,
				isRecording: true,
				startTime: Date.now(),
				recordingDuration: 0,
				recordedBlob: null,
			});
		}
	}),
);

export const stopRecordingAtom = atomFamily((panelId: string) =>
	atom(null, (_get, set, recordedBlob?: Blob) => {
		const currentState = _get(recordingStateAtomFamily(panelId));
		if (currentState.isRecording) {
			set(recordingStateAtomFamily(panelId), {
				...currentState,
				isRecording: false,
				recordedBlob: recordedBlob || null,
				startTime: null,
			});
		}
	}),
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