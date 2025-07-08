// lib/stores/replay-store.ts
// lib/stores/replay-store.ts
import { create } from "zustand";

export interface ReplayData {
	id: string;
	url: string;
	title: string;
	thumbnail?: string;
	duration?: number;
	createdAt: Date;
}

export type ReplayState =
	| "mounting"
	| "loading"
	| "playing"
	| "paused"
	| "ended"
	| "error";

export interface ReplayPlayerState {
	state: ReplayState;
	volume: number;
	playbackRate: number;
	currentTime: number;
	duration: number;
}

interface ReplayStore {
	replays: ReplayData[];
	playerStates: Record<string, ReplayPlayerState>;
	playingReplays: string[]; // Changed from Set to array
	loadedReplays: Record<string, string>;
	

	addReplay: (replay: ReplayData) => void;
	addReplays: (replays: ReplayData[]) => void;
	setPlayerState: (replayId: string, state: ReplayState) => void;
	setPlayerProperty: (
		replayId: string,
		property: keyof ReplayPlayerState,
		value: unknown,
	) => void;
	playReplay: (replayId: string) => void;
	pauseReplay: (replayId: string) => void;
	playAll: () => void;
	pauseAll: () => void;
}

const createDefaultPlayerState = (): ReplayPlayerState => ({
	state: "mounting",
	volume: 1,
	playbackRate: 1,
	currentTime: 0,
	duration: 0,
});

export const useReplayStore = create<ReplayStore>((set, get) => ({
	replays: [],
	playerStates: {},
	playingReplays: [],
	loadedReplays: {},

	addReplay: (replay) =>
		set((state) => {
			if (state.replays.some((r) => r.id === replay.id)) {
				return state; // Avoid duplicates
			}
			return {
				replays: [...state.replays, replay],
				playerStates: {
					...state.playerStates,
					[replay.id]: createDefaultPlayerState(),
				},
			};
		}),

	addReplays: (replays) =>
		set((state) => {
			const newReplays = [...state.replays];
			const newPlayerStates = { ...state.playerStates };
			const existingIds = new Set(state.replays.map((r) => r.id));

			for (const replay of replays) {
				if (!existingIds.has(replay.id)) {
					newReplays.push(replay);
					newPlayerStates[replay.id] = createDefaultPlayerState();
				}
			}
			return {
				replays: newReplays,
				playerStates: newPlayerStates,
			};
		}),

	setPlayerState: (replayId, newState) =>
		set((state) => ({
			playerStates: {
				...state.playerStates,
				[replayId]: {
					...state.playerStates[replayId],
					state: newState,
				},
			},
		})),

	setPlayerProperty: (replayId, property, value) =>
		set((state) => ({
			playerStates: {
				...state.playerStates,
				[replayId]: {
					...state.playerStates[replayId],
					[property]: value,
				},
			},
		})),

	playReplay: (replayId) =>
		set((state) => ({
			playingReplays: state.playingReplays.includes(replayId)
				? state.playingReplays
				: [...state.playingReplays, replayId],
		})),

	pauseReplay: (replayId) =>
		set((state) => ({
			playingReplays: state.playingReplays.filter((id) => id !== replayId),
		})),

	playAll: () =>
		set((state) => ({
			playingReplays: state.replays.map((r) => r.id),
		})),

	pauseAll: () =>
		set(() => ({
			playingReplays: [],
		})),
}));

export const initializeDummyData = () => {
	const dummyReplays = Array.from({ length: 50 }).map((_, i, a) => {
		const tag = `v1.2.0-beta.${a.length - i}`;
		return {
			id: `replay-${i}`,
			url: "https://www.diceui.com/assets/cloud.mp4",
			title: tag,
			createdAt: new Date(),
		};
	});
	const { addReplays, playAll } = useReplayStore.getState();
	addReplays(dummyReplays);
	playAll();
};
