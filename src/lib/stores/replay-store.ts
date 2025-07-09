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
	playerStates: Record<string, ReplayPlayerState>;
	playingReplays: string[]; // Changed from Set to array

	initializePlayerStates: (replays: ReplayData[]) => void;
	setPlayerState: (replayId: string, state: ReplayState) => void;
	setPlayerProperty: (
		replayId: string,
		property: keyof ReplayPlayerState,
		value: unknown,
	) => void;
	playReplay: (replayId: string) => void;
	pauseReplay: (replayId: string) => void;
	playAll: (replayIds: string[]) => void;
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
	playerStates: {},
	playingReplays: [],

	initializePlayerStates: (replays) =>
		set((state) => {
			const newPlayerStates = { ...state.playerStates };
			replays.forEach((replay) => {
				if (!newPlayerStates[replay.id]) {
					newPlayerStates[replay.id] = createDefaultPlayerState();
				}
			});
			return { playerStates: newPlayerStates };
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

	playAll: (replayIds) => set(() => ({ playingReplays: replayIds })),

	pauseAll: () =>
		set(() => ({
			playingReplays: [],
		})),
}));
