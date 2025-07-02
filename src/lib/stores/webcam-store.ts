// src/lib/stores/webcam-store.ts
import { create } from "zustand";

interface WebcamSelections {
	[panelId: string]: {
		deviceId: string | null;
		videoEnabled: boolean;
	};
}

interface WebcamStore {
	selections: WebcamSelections;
	setCamera: (panelId: string, deviceId: string | null) => void;
	setVideoEnabled: (panelId: string, enabled: boolean) => void;
	initializeFromLoader: (availableWebcams: MediaDeviceInfo[]) => void;
}

// Helper to get a value from localStorage
const getInitialValue = <T>(key: string, defaultValue: T): T => {
	if (typeof window === "undefined") return defaultValue;
	const item = window.localStorage.getItem(key);
	return item ? JSON.parse(item) : defaultValue;
};

export const useWebcamStore = create<WebcamStore>((set, get) => ({
	selections: {}, // Initialized by the loader
	setCamera: (panelId, deviceId) => {
		const newSelections = {
			...get().selections,
			[panelId]: { ...get().selections[panelId], deviceId },
		};
		set({ selections: newSelections });
		localStorage.setItem(
			`${panelId}.camera`,
			JSON.stringify(newSelections[panelId]),
		);
	},
	setVideoEnabled: (panelId, enabled) => {
		const newSelections = {
			...get().selections,
			[panelId]: { ...get().selections[panelId], videoEnabled: enabled },
		};
		set({ selections: newSelections });
		localStorage.setItem(
			`${panelId}.camera`,
			JSON.stringify(newSelections[panelId]),
		);
	},
	initializeFromLoader: (availableWebcams) => {
		const panelIds = ["panel-one", "panel-two", "panel-three"];
		const initialSelections: WebcamSelections = {};

		for (const id of panelIds) {
			const stored = getInitialValue<{
				deviceId: string | null;
				videoEnabled: boolean;
			} | null>(`${id}.camera`, null);

			// Validate that the stored camera still exists
			const isValid =
				stored?.deviceId &&
				availableWebcams.some((cam) => cam.deviceId === stored.deviceId);

			initialSelections[id] = {
				deviceId: isValid ? stored.deviceId : null,
				videoEnabled: stored?.videoEnabled ?? false,
			};
		}
		set({ selections: initialSelections });
	},
}));
