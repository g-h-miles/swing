import { replayQueryOptions } from "@/lib/hooks/use-replays";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { atomFamily, atomWithStorage, createJSONStorage } from "jotai/utils";

export type ReplayState =
	| "mounting"
	| "loading"
	| "playing"
	| "paused"
	| "ended"
	| "error";

export interface ReplayPlayerState {
	id: string;
	state: ReplayState;
	volume: number;
	playbackRate: number;
	currentTime: number;
	duration: number;
}

// Query atom for all replays
export const replaysQueryAtom = atomWithQuery(() => replayQueryOptions);

export const replaysIdTitleAtom = atom((get) => {
	const { data, isLoading, isSuccess, error } = get(replaysQueryAtom);

	if (isSuccess) {
		return {
			data: data.map((replay) => ({
				id: replay.id,
				title: replay.title,
			})),
			isLoading,
			error,
		};
	}
	return {
		data: [],
		isLoading,
		error,
	};
});
export const isPlayingAllReplaysAtom = atomWithStorage(
	"play-all-replays",
	false,
);

const replayStateBaseAtomFamily = atomFamily((replayId: string) =>
	atom<ReplayPlayerState>({
		id: replayId,
		state: "mounting",
		volume: 1,
		playbackRate: 1,
		currentTime: 0,
		duration: 0,
	}),
);

// Atom family for individual replay states
export const replayStateAtomFamily = atomFamily((replayId: string) =>
	atom(
		(get) => {
			const base = get(replayStateBaseAtomFamily(replayId));

			// Only use derived state if we're still in mounting state
			if (base.state === "mounting") {
				const playingIds = get(playingReplayIdsAtom);
				const initialState: ReplayState = playingIds.includes(replayId)
					? "playing"
					: "mounting";

				return {
					...base,
					state: initialState,
				};
			}

			// If not mounting, return the actual stored state
			return base;
		},
		(_get, set, newValue: ReplayPlayerState) => {
			set(replayStateBaseAtomFamily(replayId), newValue);
		},
	),
);

export const replayDataAtomFamily = atomFamily((replayId: string) =>
	atom((get) => {
		const replaysQuery = get(replaysQueryAtom);
		if (replaysQuery.status === "success") {
			return replaysQuery.data.find((replay) => replay.id === replayId) || null;
		}
		return null;
	}),
);

export const replayAtomFamily = atomFamily((replayId: string) =>
	atom(
		(get) => {
			const state = get(replayStateAtomFamily(replayId));
			const data = get(replayDataAtomFamily(replayId));
			return {
				...state,
				data,
			};
		},
		(get, set, update: Partial<ReplayPlayerState>) => {
			const current = get(replayStateAtomFamily(replayId));
			set(replayStateAtomFamily(replayId), {
				...current,
				...update,
			});
		},
	),
);

export const getReplayStateAtomFamily = atomFamily((replayId: string) =>
	atom((get) => {
		const replay = get(replayAtomFamily(replayId));
		const { data, ...state } = replay;
		return state;
	}),
);

// Get just the URL from the data
export const getReplayUrlAtomFamily = atomFamily((replayId: string) =>
	atom((get) => {
		const replay = get(replayAtomFamily(replayId));
		return replay.data?.url || null;
	}),
);

export const setPlayerStateAtomFamily = atomFamily((replayId: string) =>
	atom(null, (get, set, newState: ReplayState) => {
		const current = get(replayStateAtomFamily(replayId));
		if (current.state === newState) return;

		// Update individual state
		set(replayStateAtomFamily(replayId), {
			...current,
			state: newState,
		});

		// Update the Set - SINGLE SOURCE OF TRUTH
		const currentPlaying = get(playingReplayIdsAtom);
		const newPlaying = new Set(currentPlaying);

		const shouldBePlaying = get(isReplayPlayingAtomFamily(replayId));

		if (newState === "playing" || shouldBePlaying) {
			set(isPlayingAllReplaysAtom, true);
			newPlaying.add(replayId);
		} else {
			newPlaying.delete(replayId);
		}

		set(playingReplayIdsAtom, Array.from(newPlaying));
	}),
);

// Simplify play/pause atoms - they just call setPlayerState
export const playReplayAtomFamily = atomFamily((replayId: string) =>
	atom(null, (_get, set) => {
		set(setPlayerStateAtomFamily(replayId), "playing");
	}),
);

export const pauseReplayAtomFamily = atomFamily((replayId: string) =>
	atom(null, (_get, set) => {
		set(setPlayerStateAtomFamily(replayId), "paused");
	}),
);

const storage = createJSONStorage<string[]>(() => localStorage);
export const playingReplayIdsAtom = atomWithStorage<string[]>(
	"playing-replay-ids",
	[],
	storage,
);

export const isReplayPlayingAtomFamily = atomFamily((replayId: string) =>
	atom(
		(get) => get(playingReplayIdsAtom).includes(replayId),
		(get, set, isPlaying: boolean) => {
			const currentPlaying = get(playingReplayIdsAtom);
			const newPlaying = new Set(currentPlaying);

			if (isPlaying) {
				newPlaying.add(replayId);
			} else {
				newPlaying.delete(replayId);
			}

			set(playingReplayIdsAtom, Array.from(newPlaying));
		},
	),
);

export const togglePlayAllAtom = atom(null, (get, set) => {
	const replaysQuery = get(replaysQueryAtom);

	if (replaysQuery.status !== "success") return;

	if (get(isPlayingAllReplaysAtom)) {
		// clear storage
		set(playingReplayIdsAtom, []);

		// Pause all - call individual pause atoms
		replaysQuery.data.forEach((replay) => {
			const pauseAtom = pauseReplayAtomFamily(replay.id);
			set(pauseAtom);
		});
		set(isPlayingAllReplaysAtom, false);
	} else {
		// Play all - call individual play atoms
		replaysQuery.data.forEach((replay) => {
			const playAtom = playReplayAtomFamily(replay.id);
			set(playAtom);
		});
		set(isPlayingAllReplaysAtom, true);
	}
});
